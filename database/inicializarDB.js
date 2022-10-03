const Role = require("../models/Role");

const inicializarDB = async (db) => {
  const roles = [
    { role: "administrador" },
    { role: "docente" },
    { role: "estudiante" },
  ];

  if (!(await Role.findAll()).length) {
    await Role.bulkCreate(roles);
  }
};

module.exports = inicializarDB;
