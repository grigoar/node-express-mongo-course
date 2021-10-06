const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');

// ---- For Users -------
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find;

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
