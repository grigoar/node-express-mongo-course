const express = require('express');
const viewController = require('../controllers/viewsController');

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
router.get('/', viewController.getOverview);
router.get('/tour', viewController.getTour);

module.exports = router;
