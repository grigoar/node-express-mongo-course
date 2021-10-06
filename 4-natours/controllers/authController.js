const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//importing catchAsync so we don't use the try-catch all the time
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
