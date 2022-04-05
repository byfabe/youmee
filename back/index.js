const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: ["https://golden-florentine-41f4da.netlify.app/"], // https://golden-florentine-41f4da.netlify.app/   // http://localhost:8080

  },
});
let cors = require('cors')

app.use(cors())

let users = {};
let me;
//let date = new Date()
//.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

//Voir Emit cheatsheet: https://socket.io/fr/docs/v4/emit-cheatsheet/
//Crée un socket lors d'une nouvelle connexion
io.on("connection", (socket) => {
  console.log("a user connected");

  //Ecoute le socket lors d'une déconnexion et supprime l'utilisateurs déconnecté du tableau + envoi une MAJ de la liste des utilisateurs connectés
  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log("user disconnected");
    setTimeout(() => {
      io.emit("users", users);
    }, 1000);
  });

  //Ecoute "my message" en provenance du/des client et renvoi les informations/messages à tous les utilisateurs connectés
  socket.on("my message", (message) => {
    io.emit("my message", {
      message: message.message,
      user: message.user,
      h: message.hour,
      m: message.minute,
    });
  });

  //Ecoute "users" en provenance du/des client et envoi le nom de l'utilisateur qui vient de se connecter + la liste de utilisateurs MAJ
  socket.on("users", (data) => {
    me = data;
    //users.push({ user: data, socketId: socket.id });
    users[socket.id] = me;
    io.emit("User", { connect: me, text: " vient de se connecter" });
    io.emit("users", users);
  });

  //Ecoute typing 
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data)
  });
});
http.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
