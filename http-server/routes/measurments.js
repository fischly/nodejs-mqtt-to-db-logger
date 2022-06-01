const cfg = require('../../config.json');
const dbHelper = require('../../db/dbHelper');

const express = require('express');
const router = express.Router();

// TODO: add parameters for time range and for "resolution" (how fine grained the measurments should be returned)
router.get('/measurments', (req, res) => {
    dbHelper.getMeasurments()
        .then((result) => {
            res.status(200).json(result);
        }, (error) => {
            console.error('Error trying to read the measurments from the database: ', error);
            res.status(500).json({ error: `Internal server error at /measurments`});
        });
});


module.exports = router;
