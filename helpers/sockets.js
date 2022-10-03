const socketIO = require("socket.io");

exports.add = (server) => {
  this.io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  //On connection
  this.io.on("connection", (socket) => {
    console.log("cliente conectado");
    socket.on("solicitar-ticket", (data, callback) => {
      const nuevoTicket = this.ticketList.crearTicket();
      callback(nuevoTicket);
    });

    socket.on("enviar-pregunta", (pregunta) => {
      this.io.emit("notificar-pregunta", pregunta);
      console.log(pregunta);
    });
  });
};
