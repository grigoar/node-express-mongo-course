const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory');

// multer documentation
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     //callback
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     //user-34543dfjghsdkfg42344(ID)-23432432423(timestamp).jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
//so the images will be stored in the memory instead of in the file
// this way we can process them with sharp library
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
// const upload = multer({ dest: 'public/img/users' });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  //we need to use this because we have the image in the memory now
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  //image processor
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ---- For Users -------
//we are implementing an middleware so we can get the current user id and pass it to the factory get one
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   //instead of chaining all here, we can construct the query one operation after another
//   //query.sort().select().skip().limit();

//   //SEND RESPONSE
//   //creating a JSend
//   res.status(200).json({
//     status: 'success',
//     // requestedAt: req.requestTime,
//     results: users.length,
//     data: {
//       users: users,
//     },
//   });
//   // res.status(500).json({
//   //   status: 'error',
//   //   message: 'This route is not yet defined',
//   // });
// });

//update the user data, except the password-that is done elsewhere
//this is not updateUser, that will be use by an admin
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

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
  if (req.file) filteredBody.photo = req.file.filename;
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

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use sign up instead',
  });
};

exports.getUser = factory.getOne(User);
//this is only for administrators and do not update passwords with this-it will not work
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
