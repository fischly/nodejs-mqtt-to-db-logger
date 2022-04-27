const cfg = require('../config.json');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

let client;

/**
 * Initializes the database using the configuration from config.json and returning a Promise.
 */
function initDb() {
    return new Promise((resolve, reject) => {
        console.log('Loading the database "' + cfg.database.filename + '"...');

        // sanity check if the database exist. otherwhise print a warning.
        // if (!fs.existsSync(cfg.database.filename)) {
        //     console.warn('The database specified in config.json does not exist. Did you mean to specify an empty database?');
        // }

        client = new sqlite3.Database(cfg.database.filename, (error) => {
            if (error) {
                reject('Error loading the SQLite database:\n' + error);
                return;
            }
            // activate foreign key constraint checking
            client.get('PRAGMA foreign_keys = ON');
            resolve(client);
        });
    });    
}


/**
 * Returns the database or null, if it has not been initialized yet.
 */
function getDb() {
    if (!client) {
        console.error('Database has not been initalized yet. Please call initDb first.')
        return;
    }

    return client;
}


module.exports = {
    initDb,
    getDb
};