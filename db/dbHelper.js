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
        db.getDb().all('SELECT sensorName as name, device, unit, max(sendTime) as lastMeasurement, value as lastValue  FROM measurements GROUP BY sensorName, device', function(err, rows) {
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

function getMeasurmentsBySensor(sensorName, device) {
    return new Promise((resolve, reject) => {
        db.getDb().all(`SELECT * FROM measurements WHERE sensorName = ? and device = ?`, sensorName, device, function(err, rows) {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}

function getMeasurmentsBySensorRange(sensorName, device, startTime, endTime, steps) {
    return new Promise((resolve, reject) => {
        db.getDb().all(
            `SELECT * FROM
            (
                SELECT *, ROW_NUMBER() OVER (ORDER BY id) as rownum
                FROM measurements
                WHERE sensorName = $sensorName and device = $device and
                sendTime >= $startTime and sendTime <= $endTime 
            )
            WHERE rownum % $steps = 0
            `,
            {
                $sensorName: sensorName,
                $device: device,
                $startTime: startTime,
                $endTime: endTime,
                $steps: steps
            },

            function(err, rows) {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            }
        );
    });
}

function getMeasurmentsBySensorStartEnd(sensorName, device, startTime, endTime) {
    return new Promise((resolve, reject) => {
        db.getDb().all(`SELECT * FROM measurements WHERE sensorName = ? and device = ? and sendTime >= ? and sendTime <= ?`, 
            sensorName,
            device,
            startTime,
            endTime,

            function(err, rows) {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            }
        );
    });
}

function getMeasurmentsBySensorStart(sensorName,device, startTime) {
   return getMeasurmentsBySensor(sensorName, device, startTime, Date.now());
}



function getMeasurmentsByDevice(device) {
    return new Promise((resolve, reject) => {
        db.getDb().all(`SELECT * FROM measurements WHERE device = '?'`, device, function(err, rows) {
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
    getMeasurments,
    getMeasurmentsByDevice,
    getMeasurmentsBySensor,
    getMeasurmentsBySensorRange,
    getMeasurmentsBySensorStart,
    getMeasurmentsBySensorStartEnd
};