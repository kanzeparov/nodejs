'use strict'

const express = require('express')
const Router = require('./router')

let router = new Router()
let app = express()
let expressWs = require('express-ws')(app)
let mqtt_cl = require('./mqtt_client')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var aWss = expressWs.getWss('/');







app.ws('/', function(ws, req) {
  console.log('Socket Connected');
  ws.send("Putin huillo")

  const mqtt = new mqtt_cl.ClientMQTT()
  mqtt.add_handler(handler)
  mqtt.start()

  function handler(type, value) {
    console.log("Receive new message %o", value)
    ws.send(JSON.stringify(value))
  }
});







app.get('/data', function(req, res) {
  res.set("Access-Control-Allow-Origin","*")
  res.send('hello world');
});

// app.ws('/', function(ws, req, next) {
//   ws.on('message', function(msg) {
//     router.go(req, ws, msg)
//   })
// })

app.listen(3000, function() {
  console.log('Started, port: 3000')
})
