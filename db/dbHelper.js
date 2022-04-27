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

module.exports = {
    insertMeasurment
};