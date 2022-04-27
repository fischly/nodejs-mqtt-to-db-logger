
const config = require('./config.json');
const db = require('./db/db.js');
const dbHelper = require('./db/dbHelper.js');

const mqtt = require('mqtt');
const process = require('process');

// init the database
db.initDb().then(() => {
    // start the mqtt server
    console.log('Starting the MQTT server...');

    const mqttClient = mqtt.connect(config.mqtt.host);

    // listen for on connect event
    mqttClient.on('connect', () => {
        console.log('MQTT client connected');

        // when connected, subscribe to the topic specified in the config file
        mqttClient.subscribe(config.mqtt.topic, function(err) {
            if (err) {
                console.error('Error trying to subscribe to topic: ', err);
                process.exit(1);
            }
        });
    });

    // listen for on message events
    mqttClient.on('message', (topic, message) => {
        console.log('Received message on topic "' + topic + '": ' + message);

        // parse message and insert into database
        const parsedMessage = JSON.parse(message);
        dbHelper.insertMeasurment(parsedMessage.name, parsedMessage.value).then(() => {
            console.log('Inserted measurement into database (', parsedMessage , ')');
        }, (error) => {
            console.error('Error inserting measurement into database: ', error);
        });
    });


}, (err) => {
    console.error(err);
});