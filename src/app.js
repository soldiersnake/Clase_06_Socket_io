const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const viewRouter = require("./routes/view.router");

const app = express();

// configuracion de handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// CONFIG SOCKET
// Creamos un servidor HTTP a partir de la app de express (necesario para usar socket.io)
const http = require("http").createServer(app);
//importamos socket.io y lo conectamos al servidor HTTP
const { Server } = require("socket.io");
const io = new Server(http);

app.use("/view", viewRouter);

io.on("connection", (socket) => {
  console.log("cliente conectado");

  socket.on("message", (data) => {
    console.log(data);
    io.emit("messageLogs", data); //reeenviamos los mensajes a todos los clientes conectados
  });

  socket.on("auth", (user) => {
    // avisar a todos los demas usuaros clienta nuevo
    socket.broadcast.emit("newUser", user);
  });
});

// app.listen(8080, () => { // servidor tradicional
http.listen(8080, () => {
  // con config de SOCKET.IO
  console.log("App corriendo en puerto 8080");
});
