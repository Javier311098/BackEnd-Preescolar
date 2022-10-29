const Role = require("../models/Role");

const inicializarDB = async (db) => {
  const roles = [
    { rol: "administrador" },
    { rol: "docente" },
    { rol: "estudiante" },
    { rol: "padre" },
  ];

  if (!(await Role.findAll()).length) {
    await Role.bulkCreate(roles);
  }
};

module.exports = inicializarDB;
