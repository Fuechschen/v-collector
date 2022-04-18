import * as WebSocket from "ws";
import {EventEmitter} from "events";

export class VentuzWS extends EventEmitter {

    _ws: WebSocket;
    _parser: (data: any) => any;
    _publisher: (data: any) => any;
    _rqId: number = 0;
    _requestedFrames = 0;

    _delayFactor = 1;

    host: string;

    constructor(host: string, parser: (data: any) => any, publisher?: (data: any) => any) {
        super();

        console.log("connection created", host);

        this.host = host;
        this._parser = parser;
        this._publisher = publisher;

        this.connect();
    }

    connect() {
        try {
            if (this._ws) {
                // @ts-ignore
                if ([this._ws.CONNECTING, this._ws.OPEN].includes(this._ws.readyState)) {
                    this._ws.close(1000);
                }
            }

            this._ws = new WebSocket(`ws://${this.host}:20404/remoting/1.0/Remoting4/WS/`);

            this._ws.onopen = (event): void => {
                this._requestedFrames = +100;
                this._ws.send(`{"Address":"/Ventuz/Perf","Arguments":[100],"ArgumentTypes":"i","RequestID":${this._rqId++}}`);
            };
            this._ws.onclose = () => {
                console.warn(this.host, "websocket closed, retry in ", 1000 * this._delayFactor);
                this._delayFactor += 1;
                if (this._delayFactor > 30) this._delayFactor = 30;
                setTimeout(() => {
                    this.connect();
                }, 1000 * this._delayFactor);
            };
            this._ws.onmessage = (data) => {
                let message = JSON.parse(data.data.toString());

                if (message.Address === "/Ventuz/Perf/Frame") {
                    let parsedData = this._parser(message.Value.PerfLogText);
                    if (this._publisher) {
                        this._publisher(parsedData);
                    }
                    //console.log(message, parsedData);
                    this._requestedFrames--;
                    if (this._requestedFrames === 0) {
                        this._requestedFrames += 100;
                        this._ws.send(`{"Address":"/Ventuz/Perf","Arguments":[100],"ArgumentTypes":"i","RequestID":${this._rqId++}}`);
                    }
                }
            };
            this._ws.onerror = err => {
                console.error("ws err");
            };
        } catch (e) {
            console.error(e);
        }
    }
}
