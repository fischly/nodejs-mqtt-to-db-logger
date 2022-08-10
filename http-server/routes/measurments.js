const cfg = require('../../config.json');
const dbHelper = require('../../db/dbHelper');

const express = require('express');
const router = express.Router();

// TODO: add parameters for time range and for "resolution" (how fine grained the measurments should be returned)
router.get('/measurements', (req, res) => {
    dbHelper.getMeasurments()
        .then((result) => {
            res.status(200).json(result);
        }, (error) => {
            console.error('Error trying to read the measurements from the database: ', error);
            res.status(500).json({ error: `Internal server error at /measurements`});
        });
});

router.get('/measurements/:sensor/:device', (req, res) => {

    const start = req.query.start ? req.query.start : 0;
    const end = req.query.end ? req.query.end : Date.now() + 1000;
    const steps = req.query.steps ? req.query.steps : 1;

    console.log('/measure, sensor = ', req.params.sensor, 'device = ', req.params.device, ' start = ', start, ' end = ', end, ' steps = ', steps);

    
    if (steps == 1) {
        dbHelper.getMeasurmentsBySensorStartEnd(req.params.sensor, req.params.device, start, end)
        .then((result) => {
            res.status(200).json(result);
        }, (error) => {
            console.error('Error trying to read the measurements from the database: ', error);
            res.status(500).json({ error: `Internal server error at /measurements/:sensor with start/end`});
        });
    } else {
        dbHelper.getMeasurmentsBySensorRange(req.params.sensor, req.params.device, start, end, steps)
        .then((result) => {
            res.status(200).json(result);
        }, (error) => {
            console.error('Error trying to read the measurements from the database: ', error);
            res.status(500).json({ error: `Internal server error at /measurements/:sensor with start/end/steps`});
        });
    }


});


module.exports = router;
