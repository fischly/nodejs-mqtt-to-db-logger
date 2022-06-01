const cfg = require('../../config.json');
const dbHelper = require('../../db/dbHelper');

const express = require('express');
const router = express.Router();

router.get('/sensors', (req, res) => {
    dbHelper.getSensors()
        .then((result) => {
            res.status(200).json(result);
        }, (error) => {
            console.error('Error trying to read the measurments from the database: ', error);
            res.status(500).json({ error: `Internal server error at /sensors`});
        });
});

module.exports = router;