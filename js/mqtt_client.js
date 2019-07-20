const mqtt = require('mqtt')

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

class ClientMQTT {
    constructor () {
      this.options = {
          port: 8883,
          host: "mqtt-stage.rnd.rtsoft.ru",
          clientId: makeid(20),
          username: "user1",
          password: "jejcoilld7493",
          keepalive: 60,
          reconnectPeriod: 1000,
          rejectUnauthorized: true,
          protocol: 'mqtts'
      }
      this.started = 0
    }

    topic_handler (topic, message) {
      console.log("Received a new message from %o", topic.toString())
      let json_msg = JSON.parse(message)
      var msg_type = topic.split('/')[3]
      if (msg_type == 'power' || msg_type == 'current' || msg_type == 'voltage') {
        var power_value = {
            // For example, enodeX
            node: topic.split('/')[1],
            // For ex, portX
            port: topic.split('/')[2],
            // power
            value: json_msg.value
        }
        this.handler(msg_type, power_value)
      }
    }

    connected () {
      this.started = 1
      console.log("Connected to the broker!")
      this.Client.subscribe("testbed/+/+/power")
      this.Client.on('message', this.topic_handler.bind(this))
    }

    add_handler (handler) {
      this.handler = handler
    }

    start () {
      console.log("Starting MQTT client")
      this.Client = mqtt.connect(this.options)
      this.Client.on('connect', this.connected.bind(this))
    }

    stop () {
      this.Client.end()
    }
  }

module.exports={ClientMQTT}
