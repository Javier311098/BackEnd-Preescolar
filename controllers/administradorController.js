const { response } = require("express");
const bcrypt = require("bcryptjs");
const Administrador = require("../models/Administrador");

const crearAdministrador = async (req, resp = response) => {
  const { correo_admin, password_admin } = req.body;
  try {
    let administrador = await Administrador.findOne({
      where: { correo_admin: correo_admin },
    });
    if (administrador) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe administrador",
      });
    }
    administrador = new Administrador(req.body);
    //encriptar password
    const salt = bcrypt.genSaltSync();
    administrador.password_admin = bcrypt.hashSync(password_admin, salt);
    await administrador.save();
    resp.status(201).json({
      ok: true,
      id: administrador.id_admin,
      nombre: administrador.nombre_admin,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con otro administrador",
    });
  }
};

const loginAdministrador = async (req, resp = response) => {
  const { email, password } = req.body;
  try {
    const administrador = await Uus.findOne({ email });
    if (!administrador) {
      return resp.status(400).json({
        ok: false,
        msg: "El administrador no existe con ese email",
      });
    }
    //confirmar los passwords
    const validPassword = bcrypt.compareSync(password, administrador.password);
    if (!validPassword) {
      return resp.status(400).json({
        ok: false,
        msg: "password incorrecto",
      });
    }
    //generar JWT
    const token = await generarJWT(administrador.id, administrador.name);
    resp.status(200).json({
      ok: true,
      msg: "login",
      uid: administrador.id,
      name: administrador.name,
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con otro administrador",
    });
  }
};
const obtenerAdministradores = async (req, res = response) => {
  let administradores = await Administrador.findAll();
  res.json({
    ok: true,
    administradores,
  });
};

const obtenerAdministradorPorNombre = async (req, resp = response) => {
  const { nombre } = req.params;
  try {
    const administradorEncontrada = await Administrador.findOne({
      where: { nombre_admin: nombre },
    });
    if (!administradorEncontrada) {
      return resp.status(404).json({
        ok: false,
        msg: "El administrador no se encontro con ese nombre",
      });
    }
    resp.json({ ok: true, administrador: administradorEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con otro administrador" });
  }
};

const actualizarAdministrador = async (req, resp = response) => {
  const administradorId = req.params.id;

  try {
    const administrador = await Administrador.findByPk(administradorId);
    if (!administrador) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El administrador no existe" });
    }

    const nuevoAdministrador = { ...req.body };

    const administradorActualizada = await Administrador.update(
      nuevoAdministrador,
      {
        returning: true,
        where: { id_admin: administradorId },
      }
    );

    resp.json({ ok: true, administrador: administradorActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable otro administrador" });
  }
};

const eliminarAdministrador = async (req, resp = response) => {
  const administradorId = req.params.id;
  try {
    const administrador = await Administrador.findByPk(administradorId);
    if (!administrador) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La administrador no existe" });
    }

    const administradorDeBaja = await Administrador.destroy({
      returning: true,
      where: { id_admin: administradorId },
    });
    resp.json({
      ok: true,
      msg: "El elimino correctamente",
      administrador: administradorDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con otro administrador",
    });
  }
};
module.exports = {
  crearAdministrador,
  loginAdministrador,
  obtenerAdministradores,
  obtenerAdministradorPorNombre,
  actualizarAdministrador,
  eliminarAdministrador,
};
