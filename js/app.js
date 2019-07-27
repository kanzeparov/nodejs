'use strict'

const express = require('express')
const Router = require('./router')

let router = new Router()
let app = express()
let expressWs = require('express-ws')(app)
let mqtt_cl = require('./mqtt_client')
let trunc = require('./trunc.js')
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('plot.db');
var firebase = require('firebase');
let timeDelete = 30;
//var admin = require("firebase-admin");

var firebaseConfig = {
  apiKey: "AIzaSyCalxvSjI6Op_WLR4PNOb02zVvXyCpg_wE",
  authDomain: "onder2.firebaseapp.com",
  databaseURL: "https://onder2.firebaseio.com",
  projectId: "onder2",
  storageBucket: "",
  messagingSenderId: "1017048097094",
  appId: "1:1017048097094:web:39cd1d4029ffe5f3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//  admin.initializeApp();
const database = firebase.database();

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


const functions = require('firebase-functions');

// Max number of lines of the chat history.

var aWss = expressWs.getWss('/');
var ref = database.ref("plot/");

const mqtt = new mqtt_cl.ClientMQTT()
mqtt.add_handler(handler)
mqtt.start()
mqtt.publish77(1,true);

function handler(type, value) {

  //TOPICS WHICH CONNECT WITH GRAPH
  if (true) {

    console.log("Receive new message %o", value)
    var date = new Date();
    var timestamp = date.getTime();
    let json_msg = value;
    try {
      json_msg = JSON.parse(value)

    let date_hour_min = date.getHours() + ":" + date.getMinutes()

    database.ref('plot/' + timestamp).set({
      time: date_hour_min,
      value: json_msg.value
    });

    ref.once("value", function(snapshot) {
        console.log(snapshot.numChildren());
        snapshot.forEach((child) => {
          var date = new Date();
          var timestamp = date.getTime();
          // console.log(child.key);
          if (timestamp - child.key > timeDelete * 1000 * 60) {
            // console.log("delete " + "");
            let userRef = database.ref('plot/' + child.key);
            userRef.remove()
          }
        });
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    } catch (ex) {
      console.log(ex.toString())
    }
  }
}








app.ws('/plot', function(ws, req) {
  console.log('Socket Connected');
  ws.send("Putin huillo")

  const mqttDATA = new mqtt_cl.ClientMQTT()
  mqttDATA.add_handler(handlerDATA)
  mqttDATA.start()

  function handlerDATA(type, value) {
    console.log("Receive new message %o", value)
    ws.send(JSON.stringify(value))
  }

  ws.on('close', function() {
    mqttDATA.stop();
    console.log('The connection was closed!');
  });
});

//TODO logic with socket when it is close

//TODO make topic
//TODO topics from AMIGO
//TODO send comand to AMIGO
//TODO post from UI
//TODO bash didn't store


// app.get('/data', function(req, res) {
// console.log("Hello from get data")
// });

// app.get('/', function(req, res) {
// console.log("Hello from get /")
// });
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}



app.get('/data', function(req, res) {
  res.set("Access-Control-Allow-Origin", "*")

  // const mqttData = new mqtt_cl.ClientMQTT()
  // mqttData.add_handler(handlerData)
  // mqttData.start()
  //
  // function handlerData(type, value) {
  //   console.log("DataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataDataData new message %o", value)
  // }

  // Attach an asynchronous callback to read the data at our posts reference
  ref.once("value", function(snapshot) {
    console.log(snapshot.numChildren());
    // snapshot.forEach((child) => {
    //
    //     console.log(child.key);
    //
    // });
    res.send(snapshot.val())
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  //
  //
  //  db.run("INSERT INTO plot VALUES ('wefwe', "+getRandomArbitrary(1000,10000) +");");
  //
  // console.log("bef");
  //   res.set("Access-Control-Allow-Origin","*")
  // db.each("SELECT x, time FROM plot ORDER BY time", (err, row) => {
  //       console.log(row.x + ": " + row.time);
  //   });
  //   res.send('hello world');
  // console.log("aft");
});

// app.ws('/', function(ws, req, next) {
//   ws.on('message', function(msg) {
//     router.go(req, ws, msg)
//   })
// })

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on %o", process.env.PORT);
})
