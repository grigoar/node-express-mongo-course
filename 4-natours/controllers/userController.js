const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ---- For Users -------
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //instead of chaining all here, we can construct the query one operation after another
  //query.sort().select().skip().limit();

  //SEND RESPONSE
  //creating a JSend
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: users.length,
    data: {
      users: users,
    },
  });
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not yet defined',
  // });
});

//update the user data, except the password-that is done elsewhere
//this is not updateUser, that will be use by an admin
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.'
      )
    );
  }

  //2)Filtered out unwanted fields names that are not allowed to be updated
  //we need to filter the body we put
  const filteredBody = filterObj(req.body, 'name', 'email');
  //3) Update user document
  //now we can do the findByIdAndUpdate because we don't need to run the validators for the passwords
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // const user = await User.findById(req.user.id);
  // user.name = 'Grig';
  // await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
