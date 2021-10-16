const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.get('/', (req, res) => {
//   //it will now the path and it will search for the view file because we specified to render
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Grigoar',
//   });
// });

//we can use this with extend base to change the content of the block we want when the route is changing
//we set overview as default

//to not do isLoggedIn and also protect for me we add for each route separately
// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get(
  '/tour/:tourSlug',
  authController.isLoggedIn,
  viewController.getTour
);
// router.get('/tour', viewController.getTour);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
