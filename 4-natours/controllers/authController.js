const crypto = require('crypto');
//node module to use the promisify for verify the token
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // console.log(process.env);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//importing catchAsync so we don't use the try-catch all the time
exports.signup = catchAsync(async (req, res, next) => {
  //   const newUser = await User.create(req.body);//not secure because the role can be directly injected
  //Here need to be very carefull to specify the fields that we want to save in the database and to be shown in the output of the response
  //if we don't specify the role, we can just set it by using the default, if we are trying to inject the role manually it will not work
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,//not really needed for now
    // role: req.body.role//This is not safe to use like this, better change it directly in the database, or set a different route to change the roles of the users
  });
  createSendToken(newUser, 201, res);

  // const token = signToken(newUser._id);
  // // console.log(process.env);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) {
    //need to use return so this function finishes right away
    return next(new AppError('Please provide email and password!', 400));
  }

  //2)Check if user exists && password is correct
  //findOne filter
  //if we want to output a field that is not selected
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // console.log(user);
  //3)If everything ok, send token to client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  //2)Verification token
  //when the verification is done will call a callback function
  //this is a node.js util function
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3) Check if user still exists-in case it was deleted the token should not be available anymore
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token does not longer exist')
    );
  }

  //4) Check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//restricting routes based on the specified roles of the user
//this runs after the protect middleware and it has access to the "req.user" so we can verify what role the user have
//because we can't pass arguments to a middleware function we need to use closures to pass them=>and then using closures
//this is like a wrapper function
exports.restrictTo = (...roles) => {
  //this is a closure
  return (req, res, next) => {
    //roles is an array => roles[ "admin", "lead-guide"]. role="user" will not have access
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

//the user will send an email in order to receive a token for resetting the password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  //2)Generate the random token
  const resetToken = user.createPasswordResetToken();
  //we need to use this in order to not have the required body in this case
  //this is also used when the user is registered
  // await user.save();
  await user.save({ validateBeforeSave: false });

  //3)Send it to user's email with the un-encrypted token
  //will verify it in the next step
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n If you didn't forget your password please ignore this email!`;

  console.log(resetURL);
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is valid for 10 min',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});
//the user will send the token with the new password in order to reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //if there is a user with the token and if the token has not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3) Update changePasswordAt property for the user
  //done in the user model
  //4) Log the user in, send JWT
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, email, password, passwordConfirm } = req.body;
  //1)Get user from collection
  //we have the id of the user
  const user = await User.findById(req.user.id).select('password');
  //2) Check if POSTed current password is correct
  if (!user || !(await user.correctPassword(passwordCurrent, user.password))) {
    return next(
      new AppError(
        'The provided password does not match with the old password!'
      ),
      401
    );
  }
  //3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  const newUser = await user.save();
  //this not work because the pass can be updated only by using the save
  // User.findByIdAndUpdate

  //4) Log user in, send JWT
  createSendToken(newUser, 200, res);
});
