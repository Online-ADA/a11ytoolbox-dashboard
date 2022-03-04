import { io } from "socket.io-client";

class Websocket {
    constructor(){
        this.url = "https://oadaws.ngrok.io/";
        this.socket = io(this.url, { autoConnect: false });
        this.socket.onAny((event, ...args) => {
            console.log(event, args);
        });
    }
}

export default new Websocket()