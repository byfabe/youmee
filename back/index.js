const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:8080"],
  },
});
let users = {};
let me;

// app.get("/", (req, res) => {
//   res.send("<h1>Hey Socket.io</h1>");
// });

io.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on("connect_error", (e) => {
    console.log('ERROR', e)
});

  socket.on("disconnect", () => {
    delete users.me;
    console.log("user disconnected");
  });

  socket.on("my message", (msg) => {
    io.emit("my message", msg);
    console.log(users);
    console.log(me);
  });

  socket.on("users", (data) => {
    me = data;
    //users.push({ user: data, socketId: socket.id });
    users[me] = me;
    io.emit("User", me);
  });
  io.emit("users", users);
});

// io.on('connection', (socket) => {
//   socket.on('my message', (msg) => {
//     io.emit('my broadcast', `server: ${msg}`);
//   });
// });

http.listen(3000, () => {
  console.log("listening on *:3000");
});
