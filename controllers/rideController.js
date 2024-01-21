const config = require('../config.js');
const db = require('../database/database.js');
const asyncHandler = require('express-async-handler');

// Display new ride page.
exports.new_ride = asyncHandler(async (req, res, next) => {
    res.render('new_ride', { key: config.directionsAPI });
});

// API call for new ride.
exports.get_directions = asyncHandler(async (req, res, next) => {
    // const client = new Client({});

    // const response = await client.directions({
    //     params: {
    //         origin: 'Chicago',
    //         destination: 'Los Angeles',
    //         key: config.directionsAPI,
    //     },
    //     timeout: 1000, // milliseconds
    // });
    // console.log(response.data);

    res.json({ message: 'Hello, World!' });
    // send respone back to client...
});
