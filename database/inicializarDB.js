const Role = require("../models/Role");
const Usuario = require("../models/Usuario");
const users = require("./mockData2.json");

const inicializarDB = async (db) => {
  const roles = [
    { rol: "administrador" },
    { rol: "docente" },
    { rol: "estudiante" },
    { rol: "padre" },
  ];

  const generarUsuarios = () => {
    const todosLosUsuarios = users.map((usuario) => {
      console.log(usuario);
      return usuario;
    });

    return todosLosUsuarios;
  };

  if (!(await Role.findAll()).length) {
    await Role.bulkCreate(roles);
  }

  //descomentar si quieres generar 1000 registros con mockData de usuarios
  // if ((await Usuario.findAll()).length < 500) {
  //   await Usuario.bulkCreate(generarUsuarios());
  // }
};

module.exports = inicializarDB;
