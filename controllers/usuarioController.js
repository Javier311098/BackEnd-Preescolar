const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const EstuTutor = require("../models/Estudiante_Tutor");
const { Op } = require("sequelize");
const EstuDoce = require("../models/Estudiante_Docente");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, resp = response) => {
  const { correo_electronico, password_usuario } = req.body;
  try {
    let usuario;
    if (correo_electronico) {
      usuario = await Usuario.findOne({
        where: { correo_electronico: correo_electronico },
      });
      if (usuario) {
        return resp.status(400).json({
          ok: false,
          msg: "Ya existe usuario",
        });
      }
    }

    usuario = new Usuario(req.body);
    //encriptar password
    if (password_usuario) {
      const salt = bcrypt.genSaltSync();
      usuario.password_usuario = bcrypt.hashSync(password_usuario, salt);
    }

    await usuario.save();

    if (usuario.id_rol === 3) {
      return resp.status(201).json({
        ok: true,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          direccion_residencia: usuario.direccion_residencia,
          telefono_emergencia_1: usuario.telefono_emergencia_1,
          telefono_emergencia_2: usuario.telefono_emergencia_2,
          tipo_sangre: usuario.tipo_sangre,
          edad: usuario.edad,
          fecha_nacimiento: usuario.fecha_nacimiento,
          foto_usuario: usuario.foto_usuario,
          id_grado: usuario.id_grado,
        },
      });
    }

    resp.status(201).json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const loginUsuario = async (req, resp = response) => {
  const { correo_electronico, password_usuario } = req.body;
  try {
    const usuario = await Usuario.findOne({
      where: { correo_electronico: correo_electronico },
    });
    if (!usuario) {
      return resp.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }
    //confirmar los passwords
    const validPassword = bcrypt.compareSync(
      password_usuario,
      usuario.password_usuario
    );
    if (!validPassword) {
      return resp.status(400).json({
        ok: false,
        msg: "contraseña incorrecta",
      });
    }
    //generar JWT
    const token = await generarJWT(
      usuario.id_usuario,
      usuario.nombre_usuario,
      usuario.id_rol
    );
    resp.status(200).json({
      ok: true,
      msg: "login",
      uid: usuario.id_usuario,
      name: usuario.nombre_usuario,
      role: usuario.id_rol,
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

const revalidarToken = async (req, resp = response) => {
  const { uid, name, role } = req;
  // generar un nuevo JWT y retornarlo
  const token = await generarJWT(uid, name, role);

  resp.json({ ok: true, token, uid, name, role });
};

const obtenerUsuarios = async (req, res = response) => {
  let usuario = await Usuario.findAll();
  res.json({
    ok: true,
    usuario,
  });
};

const obtenerAlumnos = async (req, res = response) => {
  let usuario = await Usuario.findAll({ where: { id } });
  res.json({
    ok: true,
    usuario,
  });
};

const obtenerUsuarioRol = async (req, res = response) => {
  const { id } = req.params;
  let usuario = await Usuario.findAll({
    where: { [Op.and]: [{ id_rol: id }, { estatus: 1 }] },
  });

  res.json({
    ok: true,
    usuario,
  });
};

const obtenerRelacionPadre = async (req, res = response) => {
  const { id } = req.params;
  let relacion = await EstuTutor.findOne({
    where: { [Op.and]: [{ id_usuario_tutor: id }, { estatus: 1 }] },
  });
  if (!relacion) {
    return res.json({
      ok: false,
      msg: "no existe padre",
    });
  }

  const hijo = await Usuario.findOne({
    where: {
      [Op.and]: [
        { id_usuario: relacion.id_usuario_estudiante },
        { estatus: 1 },
      ],
    },
  });

  res.json({
    ok: true,
    hijo,
  });
};

const obtenerRelacionesPadres = async (req, res = response) => {
  let relaciones = await EstuTutor.findAll({
    where: { estatus: 1 },
  });

  res.json({
    ok: true,
    relaciones,
  });
};

const obtenerRelacionDocente = async (req, res = response) => {
  const { id } = req.params;
  let docente = await Usuario.findOne({
    where: { [Op.and]: [{ id_usuario: id }, { estatus: 1 }] },
  });

  if (!docente) {
    return res.json({
      ok: false,
      msg: "no existe docente",
    });
  }

  const estudiantes = await Usuario.findAll({
    where: {
      [Op.and]: [{ id_grado: docente.id_grado }, { id_rol: 3 }, { estatus: 1 }],
    },
  });

  res.json({
    ok: true,
    estudiantes,
  });
};

const obtenerUsuarioPorNombre = async (req, resp = response) => {
  const { nombre } = req.params;
  try {
    const usuarioEncontrada = await Usuario.findOne({
      where: { nombre_usuario: nombre },
    });
    if (!usuarioEncontrada) {
      return resp.status(404).json({
        ok: false,
        msg: "El usuario no se encontro con ese nombre",
      });
    }
    resp.json({ ok: true, usuario: usuarioEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarUsuario = async (req, resp = response) => {
  const usuarioId = req.params.id;

  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return resp.status(404).json({ ok: false, msg: "El usuario no existe" });
    }

    const nuevoUsuario = { ...req.body };

    const usuarioActualizado = await Usuario.update(nuevoUsuario, {
      returning: true,
      where: { id_usuario: usuarioId },
    });

    resp.json({ ok: true, usuario: usuarioActualizado });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable el administrador" });
  }
};

const actualizarRelacionAlumnoTutor = async (req, resp = response) => {
  const padreId = req.params.id;
  try {
    const tutor = await EstuTutor.findOne({
      where: { id_usuario_tutor: padreId },
    });
    if (!tutor) {
      return resp.status(404).json({ ok: false, msg: "El tutor no existe" });
    }

    const nuevaRelacion = { ...req.body };

    const relacionActualizada = await EstuTutor.update(nuevaRelacion, {
      returning: true,
      where: { id_usuario_tutor: padreId },
    });

    resp.json({ ok: true, relacion: relacionActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable el administrador" });
  }
};

const darDeBajaRelacionAlumnoTutor = async (req, resp = response) => {
  const padreId = req.params.id;

  try {
    const tutor = await EstuTutor.findOne({
      where: { id_usuario_tutor: padreId },
    });
    if (!tutor) {
      return resp.status(404).json({ ok: false, msg: "El tutor no existe" });
    }
    if (tutor.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "la relacion ya se dio de baja anteriormente",
      });
    }
    const relacionDeBaja = await EstuTutor.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_usuario_tutor: padreId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      relacion: relacionDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable el administrador" });
  }
};

const darDeBajaUsuario = async (req, resp = response) => {
  const usuarioId = req.params.id;
  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return resp.status(404).json({ ok: false, msg: "El usuario no existe" });
    }
    if (usuario.estatus === 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El usuario ya se dio de baja anteriormente" });
    }
    const usuarioDeBaja = await Usuario.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_usuario: usuarioId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      usuario: usuarioDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarUsuario = async (req, resp = response) => {
  const usuarioId = req.params.id;
  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return resp.status(404).json({ ok: false, msg: "La usuario no existe" });
    }
    if (usuario.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "el usuario primero debe darse de baja" });
    }
    const usuarioDeBaja = await Usuario.destroy({
      returning: true,
      where: { id_usuario: usuarioId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      usuario: usuarioDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const relacionarEstudianteTutores = async (req, resp = response) => {
  const { id_usuario_tutor, id_usuario_estudiante } = req.body;
  console.log({ id_usuario_tutor });
  try {
    let existeEstudiante = await EstuTutor.findOne({
      where: {
        [Op.and]: [
          { id_usuario_estudiante: id_usuario_estudiante },
          { estatus: 1 },
        ],
      },
    });
    if (existeEstudiante) {
      return resp.status(400).json({
        ok: false,
        msg: "Este estudiante ya tiene un tutor",
      });
    }

    const estudiante = await Usuario.findOne({
      where: {
        [Op.and]: [{ id_usuario: id_usuario_estudiante }, { id_rol: 3 }],
      },
    });
    const tutor = await Usuario.findOne({
      where: { [Op.and]: [{ id_usuario: id_usuario_tutor }, { id_rol: 4 }] },
    });

    if (!estudiante || estudiante.estatus === 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El estudiante no existe" });
    }

    if (!tutor || tutor.estatus === 0) {
      return resp.status(404).json({ ok: false, msg: "El tutor no existe" });
    }

    relacion = new EstuTutor(req.body);
    await relacion.save();
    resp.json({
      ok: true,
      msg: "Se relaciono estudiante con el tutor correctamente",
      relacion: relacion,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const relacionarEstudianteDocente = async (req, resp = response) => {
  const { id_usuario_docente, id_usuario_estudiante } = req.body;

  try {
    if (id_usuario_estudiante) {
      let usuario = await EstuDoce.findOne({
        where: { id_usuario_estudiante: id_usuario_estudiante },
      });
      if (usuario) {
        return resp.status(400).json({
          ok: false,
          msg: "Este estudiante ya tiene docente",
        });
      }
    }

    const estudiante = await Usuario.findOne({
      where: {
        [Op.and]: [{ id_usuario: id_usuario_estudiante }, { id_rol: 3 }],
      },
    });
    const docente = await Usuario.findOne({
      where: { [Op.and]: [{ id_usuario: id_usuario_docente }, { id_rol: 2 }] },
    });

    if (!estudiante || estudiante.estatus === 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El estudiante no existe" });
    }

    if (!docente || docente.estatus === 0) {
      return resp.status(404).json({ ok: false, msg: "El docente no existe" });
    }

    relacion = new EstuDoce(req.body);
    await relacion.save();
    resp.json({
      ok: true,
      msg: "Se relaciono estudiante con el tutor correctamente",
      relacion: relacion,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const darDeBajaEstuTutorRelacion = async (req, resp = response) => {
  const estuId = req.params.id;
  try {
    const relacion = await EstuTutor.findByPk(estuId);
    if (!relacion) {
      return resp.status(404).json({ ok: false, msg: "La relacion no existe" });
    }
    if (relacion.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La relacion  ya se dio de baja anteriormente",
      });
    }
    const relacionDeBaja = await EstuTutor.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_estu: estuId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      relacion: relacionDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const darDeBajaEstuDoceRelacion = async (req, resp = response) => {
  const esdoId = req.params.id;
  try {
    const relacion = await EstuDoce.findByPk(esdoId);
    if (!relacion) {
      return resp.status(404).json({ ok: false, msg: "La relacion no existe" });
    }
    if (relacion.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La relacion  ya se dio de baja anteriormente",
      });
    }
    const relacionDeBaja = await EstuDoce.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_esdo: esdoId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      relacion: relacionDeBaja,
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
  crearUsuario,
  loginUsuario,
  revalidarToken,
  obtenerUsuarios,
  obtenerAlumnos,
  obtenerUsuarioRol,
  obtenerUsuarioPorNombre,
  obtenerRelacionPadre,
  obtenerRelacionDocente,
  darDeBajaUsuario,
  actualizarUsuario,
  eliminarUsuario,
  relacionarEstudianteTutores,
  obtenerRelacionesPadres,
  relacionarEstudianteDocente,
  darDeBajaEstuTutorRelacion,
  darDeBajaEstuDoceRelacion,
  actualizarRelacionAlumnoTutor,
  darDeBajaRelacionAlumnoTutor,
};
