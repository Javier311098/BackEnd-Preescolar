const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

const crearUsuario = async (req, resp = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ where: { email: email } });
    if (usuario) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe usuario",
      });
    }
    usuario = new Usuario(req.body);
    //encriptar password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();
    //generar jwt
    // const token = await generarJWT(usuario.id, usuario.name);
    resp.status(201).json({ ok: true, id: usuario.id, name: usuario.name });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const loginUsuario = async (req, resp = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Uus.findOne({ email });
    if (!usuario) {
      return resp.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }
    //confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return resp.status(400).json({
        ok: false,
        msg: "password incorrecto",
      });
    }
    //generar JWT
    const token = await generarJWT(usuario.id, usuario.name);
    resp.status(200).json({
      ok: true,
      msg: "login",
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

// const revalidarToken = async (req, resp = response) => {
//   const { uid, name } = req;
//   // generar un nuevo JWT y retornarlo
//   const token = await generarJWT(uid, name);

//   resp.json({ ok: true, token, uid, name });
// };

module.exports = {
  crearUsuario,
  // getUsuarios,
  // getUsuario,
  // actualizarUsuario,
  // eliminarUsuario,
};
