'use strict'

const express = require('express')

let app = express()
let expressWs = require('express-ws')(app)
let mqtt_cl = require('./mqtt_client')

const mqtt = new mqtt_cl.ClientMQTT()
mqtt.add_handler(handler)
mqtt.start()

function handler(type, value) {
  console.log("Receive new message %o", value)
}

app.listen(3000, function() {
  console.log('Started, port: 3000')
})
