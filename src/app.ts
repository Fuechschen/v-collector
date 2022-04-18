import * as fs from "fs";
import {VentuzDiagnosticsParserV0608} from "./diagnosticsParsers/V0608";
import {VentuzWS} from "./perfCollectors/VentuzWS";
import * as aedes from "aedes";
import {createServer} from "aedes-server-factory";

// @ts-ignore
const broker = aedes();
const httpServer  = createServer(broker, { ws: true })
const port = 8888;


httpServer.listen(port, function () {
    console.log('websocket server listening on port ', port);
});

let subscriptionStatus: any = {};
let wsClients: any = {};

broker.on("subscribe", (subscriptions, client) => {
    console.log("subscription from client", subscriptions, client.id);
    for (let subscription of subscriptions) {
        if (subscription.topic.match(/vz\/remoting\/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/perf/i)) {
            if (!subscriptionStatus[subscription.topic]) {
                subscriptionStatus[subscription.topic] = [];
                let matches = subscription.topic.match(/\/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\//gi);
                if (matches.length != 1) {
                    continue;
                }
                let host = matches[0].replace(/\/*/g,"");

                wsClients[subscription.topic] = new VentuzWS(host, VentuzDiagnosticsParserV0608.parse, (message) => {
                    let messageContent: any;
                    if (typeof message === 'string') {
                        messageContent = message;
                    } else if (typeof message === 'object') {
                        messageContent = JSON.stringify(message)
                    } else {
                        messageContent = message.toString();
                    }
                    broker.publish({
                        cmd: 'publish',
                        qos: 2,
                        dup: false,
                        topic: subscription.topic,
                        payload: Buffer.from(messageContent),
                        retain: false,
                    }, () => {
                    })
                });
            }
            if (subscriptionStatus[subscription.topic].includes(subscription.topic)) {
                continue;
            }
            subscriptionStatus[subscription.topic].push(client.id);
        }
    }
});


let wsConn = new VentuzWS("localhost", VentuzDiagnosticsParserV0608.parse,);

wsConn.on("message", console.log);
