const { response } = require("express");
const { Op } = require("sequelize");
const Actividad = require("../models/Actividad");
const Clase = require("../models/Clase");
const EstuDoce = require("../models/Estudiante_Docente");
const EstuTutor = require("../models/Estudiante_Tutor");
const Grado = require("../models/Grado");
const Periodo = require("../models/Periodo");
const Usuario = require("../models/Usuario");

const crearClase = async (req, resp = response) => {
  const { id_actividad, id_grado, id_periodo } = req.body;
  try {
    let actividad = await Actividad.findOne({
      where: { id_actividad: id_actividad },
    });
    if (!actividad) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe la actividad",
      });
    }
    let grado = await Grado.findOne({
      where: { id_grado: id_grado },
    });
    if (!grado) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe el grado",
      });
    }
    let periodo = await Periodo.findOne({
      where: { id_periodo: id_periodo },
    });
    if (!periodo) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe el periodo",
      });
    }

    let clase = new Clase(req.body);
    await clase.save();
    resp.status(201).json({
      ok: true,
      clase: clase,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerClases = async (req, res = response) => {
  let periodo = await Periodo.findByPk();
  let actividad = await Actividad.findByPk();
  let grado = await Grado.findByPk();
  const { roleId } = req.params;
  let clases;
  if (parseInt(roleId) !== 1) {
    clases = await Clase.findAll({ where: { estatus: 1 } });
  } else {
    clases = await Clase.findAll();
  }

  res.json({
    ok: true,
    clases,
  });
};

const obtenerClasePorGrado = async (req, resp = response) => {
  const { id, roleId } = req.params;
  try {
    if (parseInt(roleId) === 4) {
      const relacion = await EstuTutor.findOne({
        where: { [Op.and]: [{ id_usuario_tutor: id }, { estatus: 1 }] },
      });

      const estudiante = await Usuario.findOne({
        where: {
          [Op.and]: [
            { id_usuario: relacion.id_usuario_estudiante },
            { estatus: 1 },
          ],
        },
      });

      const clases = await Clase.findAll({
        where: {
          [Op.and]: [{ id_grado: estudiante.id_grado }, { estatus: 1 }],
        },
      });
      return resp.json({
        ok: true,
        clases,
      });
    }

    const docente = await Usuario.findOne({
      where: { [Op.and]: [{ id_usuario: id }, { estatus: 1 }] },
    });
    if (!docente) {
      return resp.status(404).json({
        ok: false,
        msg: "docente no encontrado",
      });
    }
    const clases = await Clase.findAll({
      where: {
        [Op.and]: [{ id_grado: docente.id_grado }, { estatus: 1 }],
      },
    });

    resp.json({ ok: true, clases });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarClase = async (req, resp = response) => {
  const claseId = req.params.id;

  try {
    const clase = await Clase.findByPk(claseId);
    if (!clase) {
      return resp.status(404).json({ ok: false, msg: "La clase no existe" });
    }

    const nuevaClase = { ...req.body };

    const claseActualizada = await Clase.update(nuevaClase, {
      returning: true,
      where: { id_clase: claseId },
    });

    resp.json({ ok: true, clase: claseActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaClase = async (req, resp = response) => {
  const claseId = req.params.id;
  try {
    const clase = await Clase.findByPk(claseId);
    if (!clase) {
      return resp.status(404).json({ ok: false, msg: "La clase no existe" });
    }
    if (clase.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La clase ya se dio de baja anteriormente",
      });
    }
    const claseDeBaja = await Clase.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_clase: claseId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      clase: claseDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarClase = async (req, resp = response) => {
  const claseId = req.params.id;
  try {
    const clase = await Clase.findByPk(claseId);
    if (!clase) {
      return resp.status(404).json({ ok: false, msg: "La clase no existe" });
    }
    if (clase.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El clase primero debe darse de baja" });
    }
    const claseDeBaja = await Clase.destroy({
      returning: true,
      where: { id_clase: claseId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      clase: claseDeBaja,
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
  crearClase,
  obtenerClases,
  obtenerClasePorGrado,
  actualizarClase,
  darDeBajaClase,
  eliminarClase,
};
