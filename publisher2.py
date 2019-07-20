import paho.mqtt.client as mqtt
import time
import ssl
import time
import random
import json

class Contract():
    def __init__(self, node_num):
        self.node_num = node_num
        self.preamble = "/testbed/enode" + str(node_num) + "/contracts/"
        self.approved_rcv = 0
        self.approv_status = None

    def on_connect(self, client, obj, flags, rc):
        print("Connected")
        payload = {
            "value" : 1
        }
        self.request_contract(payload, seller_id=2)

    def set_params(self, params):
        pass

    def connect2broker(self):
        print("Connecting...")
        client = mqtt.Client("startblock2", protocol=mqtt.MQTTv31)
        client.on_message=(lambda cl, usr, msg: self.on_message(cl, usr, msg))
        client.on_log=(lambda cl, usrdat, lvl, buf: self.on_log(cl, usrdat, lvl, buf))
        client.on_connect=(lambda cl, obj, fl, rc: self.on_connect(cl, obj, fl, rc))

        client._ssl_context = None
        context = ssl.SSLContext(ssl.PROTOCOL_TLSv1)
        context.verify_mode = ssl.CERT_NONE
        context.load_default_certs()
        client.tls_set_context(context)
        client.tls_insecure_set(True)
        client.username_pw_set("user1", password="jejcoilld7493")
        client.connect("mqtt-stage.rnd.rtsoft.ru", port=8883)
        self.client = client

    def request_contract(self, payload, seller_id):
        print("Ussue a power package")
        payload["timestamp"] = int(time.time())

        json_payload = json.dumps(payload)
        self.client.publish("testbed/enode1/port0/power", json_payload, qos=0)

# ================================

contract = Contract(node_num=1)
contract.connect2broker()
contract.client.loop_forever()
