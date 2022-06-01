const db = require('./db');


function insertMeasurment(sensorName, value) {
    return new Promise((resolve, reject) => {
        db.getDb().run('INSERT INTO measurements (sensorName, value) VALUES (?, ?)', sensorName, value, function(err) {
            if (err) {
                reject(err);
            }

            resolve(this.lastID);
        });
    });
}

function getSensors() {
    return new Promise((resolve, reject) => {
        db.getDb().all('SELECT sensorName, min(date) as date, value  FROM measurements GROUP BY sensorName', function(err, rows) {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

function getMeasurments() {
    return new Promise((resolve, reject) => {
        db.getDb().all('SELECT * FROM measurements', function(err, rows) {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

module.exports = {
    insertMeasurment,
    getSensors,
    getMeasurments
};