const ws = require("ws");
const fs = require("fs");

let reqId = 100;

let socket = new ws("ws://192.168.50.4:20404/remoting/1.0/Remoting4/WS/");

socket.on('message', data=>{
    fs.writeFileSync(`${__dirname}/data.json`,JSON.parse(data).Value.PerfLogText);
});

socket.on('open', () => {
    console.log('open!');
    socket.send(`{"Address":"/Ventuz/Perf","Arguments":[2],"ArgumentTypes":"i","RequestID":${reqId}}`);
});

