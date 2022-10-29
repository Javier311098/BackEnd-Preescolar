const { response } = require("express");
const { Op } = require("sequelize");
const Role = require("../models/Role");

const crearRole = async (req, resp = response) => {
  const { rol } = req.body;
  try {
    let role = await Role.findOne({
      where: { rol: rol },
    });
    if (role) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe ese role",
      });
    }
    role = new Role(req.body);
    await role.save();
    resp.status(201).json({
      ok: true,
      role: role,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerRoles = async (req, res = response) => {
  let roles = await Role.findAll();
  res.json({
    ok: true,
    roles,
  });
};

const actualizarRole = async (req, resp = response) => {
  const roleId = req.params.id;

  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return resp.status(404).json({ ok: false, msg: "La role no existe" });
    }
    if (role.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La role no se encontro",
      });
    }
    const nuevaRole = { ...req.body };

    const roleActualizada = await Role.update(nuevaRole, {
      returning: true,
      where: { id_rol: roleId },
    });

    resp.json({ ok: true, role: roleActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaRole = async (req, resp = response) => {
  const roleId = req.params.id;
  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return resp.status(404).json({ ok: false, msg: "Role no existe" });
    }
    if (role.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "Este role ya se dio de baja anteriormente",
      });
    }
    const roleDeBaja = await Role.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_rol: roleId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      role: roleDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarRole = async (req, resp = response) => {
  const roleId = req.params.id;
  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return resp.status(404).json({ ok: false, msg: "El role no existe" });
    }
    if (role.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El role primero debe darse de baja" });
    }
    const roleDeBaja = await Role.destroy({
      returning: true,
      where: { id_rol: roleId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      role: roleDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  crearRole,
  obtenerRoles,
  actualizarRole,
  darDeBajaRole,
  eliminarRole,
};
