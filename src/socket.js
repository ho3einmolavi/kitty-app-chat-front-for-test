import { io } from "socket.io-client";

const URL = "https://igmu-chat-server-mmfeljavya-nw.a.run.app";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
