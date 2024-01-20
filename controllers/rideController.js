const User = require('../models/user');
const config = require('../config.js');
const asyncHandler = require('express-async-handler');
const { Client } = require('@googlemaps/google-maps-services-js');

// Display list of all users.
exports.new_ride = asyncHandler(async (req, res, next) => {
    // const client = new Client({});
    // try {
    //     const response = await client.directions({
    //         params: {
    //             origin: 'Chicago',
    //             destination: 'Los Angeles',
    //             key: config.directionsAPI,
    //         },
    //         timeout: 1000, // milliseconds
    //     });
    //     console.log(response.data);
    // } catch (error) {
    //     console.log(error);
    // }

    res.render('new_ride');
});
