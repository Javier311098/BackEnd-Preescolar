const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./database/config");
const inicializarDB = require("./database/inicializarDb");
const app = express();

//CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//Rutas
app.use("/api/usuario", require("./routes/usuario"));
app.use("/api/materias", require("./routes/materias"));
app.use("/api/actividades", require("./routes/actividades"));
app.use("/api/grados", require("./routes/grados"));
app.use("/api/periodos", require("./routes/periodos"));
app.use("/api/calificaciones", require("./routes/calificaciones"));
app.use("/api/asistencias", require("./routes/asistencias"));
app.use("/api/clases", require("./routes/clases"));
app.use("/api/roles", require("./routes/roles"));

const server = app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
  db.sync({ alter: true })
    .then(() => {
      inicializarDB(db);
      console.log("Conexion a DB exitosa");
    })
    .catch((e) => console.log(e));
});

// Web sockets
require("./helpers/sockets").add(server);

module.exports = { server };
