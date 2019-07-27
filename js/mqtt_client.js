const mqtt = require('mqtt')

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class ClientMQTT {
  constructor() {
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

  topic_handler(topic, message) {
    console.log("Received a new message from %o - %o", topic.toString(), message.toString())
    let json_msg = JSON.parse(message)
    var topicMas = topic.split('/')
    var msg_type = topic.split('/')[3]

    //97,93
    if (topicMas.length == 5) {
      if (topic.split('/')[5] == 'status' && (topic.split('/')[4] == 'ac' ||
          topic.split('/')[4] == 'der') &&
         topic.split('/')[2].toString().includes('enode')) {
        console.log("97,93 topic")
        var power_value = {

          // For example, enodeX
          node: topic.split('/')[1],
          // For ex, portX
          port1: topic.split('/')[2],
          port2: topic.split('/')[3],
          port3: topic.split('/')[4],
          value: json_msg.value,
          // power
          timeStamp: json_msg.timeStamp
        }
        this.handler(msg_type, JSON.stringify(power_value))
      }
    }

    //101
    if (topicMas.length == 5) {
      if (topic.split('/')[5] == 'status' && topic.split('/')[4].toString().includes('relay')
       && topic.split('/')[2].toString().includes('enode')) {
        console.log("101 topic")
        var power_value = {

          // For example, enodeX
          node: topic.split('/')[1],
          // For ex, portX
          port1: topic.split('/')[2],
          port2: topic.split('/')[3],
          port3: topic.split('/')[4],
          value: json_msg.value,
          // power
          timeStamp: json_msg.timeStamp
        }
        this.handler(msg_type, JSON.stringify(power_value))
      }
    }

    //18
    if (topicMas.length == 5) {
      if (topic.split('/')[5] == 'init' && topic.split('/')[4] == 'contractID') {
        console.log("18 topic")
        var power_value = {

          // For example, enodeX
          node: topic.split('/')[1],
          // For ex, portX
          port1: topic.split('/')[2],
          port2: topic.split('/')[3],
          port3: topic.split('/')[4],
          id: json_msg.id,
          portX: json_msg.port,
          mode: json_msg.mode,
          amount: json_msg.amount,
          seller: json_msg.seller,
          contragent: json_msg.contragent,
          const: json_msg.const,
          // power
          timeStamp: json_msg.timestamp
        }
        this.handler(msg_type, JSON.stringify(power_value))
      }
    }

    //87
    if (topicMas.length == 4) {
      if (topic.split('/')[4] == 'status' && topic.split('/')[4].toString().includes('dc'))
  console.log("87 topic")
        var power_value = {
          // For example, enodeX
          node: topic.split('/')[1],
          // For ex, portX
          port1: topic.split('/')[2],
          port2: topic.split('/')[3],
          time: json_msg.timeStamp,
          // power
          value: json_msg.value
        }
      this.handler(msg_type, JSON.stringify(power_value))
    }
    //16, 6, 32,33,34,35
    if (topicMas.length == 4) {
      if (msg_type == 'ext_battery' ||
        (topic.split('/')[2].toString().includes('enode') &&
          topic.split('/')[3].toString().includes('port')) ||
        (topic.split('/')[2].toString().includes('enode') &&
          topic.split('/')[3].toString().includes('load') &&
          topic.split('/')[4] == 'value')
      ) {
        if (topic.split('/')[4] == 'power') {
console.log("16, 6, 32,33,34,35 topic")
          var power_value = {
            // For example, enodeX
            node: topic.split('/')[1],
            // For ex, portX
            port1: topic.split('/')[2],
            port2: topic.split('/')[3],
            time: json_msg.timeStamp,
            // power
            value: json_msg.value
          }
          this.handler(msg_type, JSON.stringify(power_value))
        }
      }
    }


    //113,107,57,23,random
    if (msg_type == 'voltage' || msg_type == 'current' || msg_type == 'finance' ||
      msg_type == 'case_id' && topic.split('/')[2] == 'amigo' ||
      msg_type == 'power' && topic.split('/')[2].toString().includes('emeter') ||
      msg_type == 'set_price' && topic.split('/')[2] == 'amigo' ||
      msg_type == 'setpower_out' && topic.split('/')[2] == 'erouter' ||
      msg_type == 'freq' || msg_type == 'power') {
console.log("113,107,57,23,random topic")
      var power_value = {
        // For example, enodeX
        node: topic.split('/')[1],
        // For ex, portX
        port: topic.split('/')[2],
        time: json_msg.timeStamp,
        // power
        value: json_msg.value
      }
      this.handler(msg_type, JSON.stringify(power_value))
    }
  }

  publish77(enode, value) {
    console.log("publish77 is hooked")
    let topic = "testbed/enode" + String(enode) + "/relay/ac/mode"
    let payload = {
      value: value,
      timeStamp: new Date().toISOString()
    }
    this.Client.publish(topic, JSON.stringify(payload))
  }

  publish73(enode, value) {
    console.log("publish73 is hooked")
    let topic = "testbed/enode" + String(enode) + "/relay/der/mode"
    let payload = {
      value: value,
      timeStamp: new Date().toISOString()
    }
    this.Client.publish(topic, JSON.stringify(payload))
  }

  publish67(dc_num, value) {
    console.log("publish67 is hooked")
    let topic = "/testbed/relay/dc" + String(dc_num) + "mode"
    let payload = {
      value: value,
      timeStamp: new Date().toISOString()
    }
    this.Client.publish(topic, JSON.stringify(payload))
  }

  connected() {
    this.started = 1
    console.log("Connected to the broker!")
    this.Client.subscribe("/testbed/+/+")
    this.Client.on('message', this.topic_handler.bind(this))
  }


  add_handler(handler) {
    this.handler = handler
  }

  start() {
    console.log("Starting MQTT client")
    this.Client = mqtt.connect(this.options)
    this.Client.on('connect', this.connected.bind(this))
  }

  stop() {
    this.Client.end()
  }
}


module.exports = {
  ClientMQTT
}
