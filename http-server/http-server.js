
const config = require('../config.json');

const express = require('express');

const measurementsRoute = require('./routes/measurments');
const sensorsRoute = require('./routes/sensors');


function load(app) {
    // data routes
    app.use('/data', measurementsRoute, sensorsRoute);

    // static file route
    app.use(express.static(__dirname + '/../front-end/'));
}

module.exports = load;