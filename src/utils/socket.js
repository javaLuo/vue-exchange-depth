import SockJS from "sockjs-client";

export let socket;

export const initSocket = () => {
  socket = new SockJS("https://stream.binance.com:9443");

  socket.onopen = function () {
    console.log("open");
    socket.send("test");
  };

  socket.onmessage = function (e) {
    console.log("message", e.data);
    socket.close();
  };

  socket.onclose = function () {
    console.log("close");
  };

  // socket.addEventListener("open", () => {
  //   // socket 链接打开
  // });

  // socket.addEventListener("message", msg => {
  //   // 接收到数据
  //   console.log(msg);
  // });

  // socket.addEventListener("close", () => {
  //   // socket 关闭
  // });

  // socket.addEventListener("error", () => {
  //   // socket 报错
  // });
};

export const sendMsg = data => {
  socket.send(JSON.stringify(data).toString());
};

export const closeSocket = () => {
  socket.close();
  socket = null;
};

export default {
  socket,
  initSocket,
  sendMsg,
};
