const db = require('./db');


function insertMeasurment(sensorName, value, unit, device, sendTime) {
    return new Promise((resolve, reject) => {
        db.getDb().run('INSERT INTO measurements (sensorName, value, unit, device, sendTime) VALUES (?, ?, ?, ?, ?)', 
            sensorName, 
            value,
            unit,
            device,
            sendTime,
            
            function(err) {
                if (err) {
                    reject(err);
                }

                resolve(this.lastID);
            }
        );
    });
}

function getSensors() {
    return new Promise((resolve, reject) => {
        db.getDb().all('SELECT sensorName as name, device, unit, max(sendTime) as lastMeasurement, value as lastValue  FROM measurements GROUP BY sensorName', function(err, rows) {
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