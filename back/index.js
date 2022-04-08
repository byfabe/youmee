const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: ["https://golden-florentine-41f4da.netlify.app/"], // https://golden-florentine-41f4da.netlify.app/   // http://localhost:8080
  },
});
let cors = require("cors");

app.use(cors());

let messages = [];
let users = [];
let me;

//Voir Emit cheatsheet: https://socket.io/fr/docs/v4/emit-cheatsheet/
//Crée un socket lors d'une nouvelle connexion
io.on("connection", (socket) => {
  console.log("a user connected");
  

  //Ecoute le socket lors d'une déconnexion et supprime l'utilisateurs déconnecté du tableau + envoi une MAJ de la liste des utilisateurs connectés
  socket.on("disconnect", () => {
    const removeIndex = users.findIndex((item) => item.socket === socket.id);
    if (removeIndex >= 0) {
      users.splice(removeIndex, 1);
    }

    console.log("user disconnected");

    setTimeout(() => {
      io.emit("users", users);
    }, 1000);
  });

  //Ecoute "my message" en provenance du/des client et renvoi les informations/messages à tous les utilisateurs connectés
  socket.on("my message", (message) => {
    messages.push(message);
    io.in(message.room).emit("my message", messages);
  });

  //Ecoute "users" en provenance du/des client et envoi le nom de l'utilisateur qui vient de se connecter + la liste de utilisateurs MAJ
  socket.on("users", (data) => {
    me = data.user;
    users.push({ socket: socket.id, avatar: data.avatar, user: data.user });
    io.emit("User", { connect: me, text: " vient de se connecter" });
    io.emit("users", users);
  });

  //Ecoute typing
  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
    if (data.typing === false) {
      socket.broadcast.emit("typing", data);
    }
  });

  //Ecoute les entrées des rooms
  socket.on("enter_room", (data) => {
    socket.join(data);
    socket.emit("messages", messages);
    console.log(socket.rooms);
  });

  //Ecoute les sorties des rooms
  socket.on("leave_room", (data) => {
    socket.leave(data);
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
