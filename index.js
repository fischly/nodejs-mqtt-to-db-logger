
const config = require('./config.json');
const db = require('./db/db.js');
const dbHelper = require('./db/dbHelper.js');

const express = require('express');
const mqtt = require('mqtt');
const process = require('process');

const mqttLogger = require('./mqtt-logger/mqtt-logger');
const httpServer = require('./http-server/http-server');
const websocketServer = require('./websocket-server/websocket-server');

// init the database
db.initDb().then(() => {
    const app = express();

    const mqttClient = mqttLogger();
    const httpServerInstance = httpServer(app);
    
    const server = app.listen(config.http.port, () => {
        console.log('HTTP server running on port ', config.http.port);
    });

    // const websocketServerInstance = websocketServer(server);

}, (err) => {
    console.error(err);
});