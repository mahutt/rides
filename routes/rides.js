var express = require('express');
var router = express.Router();

// Require controller modules.
const ride_controller = require('../controllers/rideController');

// GET users listing
router.get('/', ride_controller.new_ride);

// GET users listing
router.post('/', ride_controller.get_directions);

module.exports = router;
