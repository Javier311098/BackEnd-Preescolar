const { response } = require("express");
const { Op } = require("sequelize");
const Calificacion = require("../models/Calificacion");

const crearCalificacion = async (req, resp = response) => {
  const { id_materia } = req.body;
  try {
    let calificacion = await Calificacion.findOne({
      where: { id_materia: id_materia },
    });
    if (calificacion) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe la Calificacion para esa materia",
      });
    }
    calificacion = new Calificacion(req.body);
    await calificacion.save();
    resp.status(201).json({
      ok: true,
      calificacion: calificacion,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerCalificaciones = async (req, res = response) => {
  let calificaciones = await Calificacion.findAll();
  res.json({
    ok: true,
    calificaciones,
  });
};

const obtenerCalificacionPorNombre = async (req, resp = response) => {
  const { nombre } = req.params;
  try {
    const calificacionEncontrada = await Calificacion.findOne({
      where: { [Op.and]: [{ nombre_calificacion: nombre }, { estatus: 1 }] },
    });
    if (!calificacionEncontrada) {
      return resp.status(404).json({
        ok: false,
        msg: "La calificacion no se encontro con ese nombre",
      });
    }
    resp.json({ ok: true, calificacion: calificacionEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarCalificacion = async (req, resp = response) => {
  const calificacionId = req.params.id;

  try {
    const calificacion = await Calificacion.findByPk(CalificacionId);
    if (!calificacion) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La Calificacion no existe" });
    }
    if (calificacion.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La calificacion no se encontro",
      });
    }
    const nuevaCalificacion = { ...req.body };

    const calificacionActualizada = await Calificacion.update(
      nuevaCalificacion,
      {
        returning: true,
        where: { id_calificacion: calificacionId },
      }
    );

    resp.json({ ok: true, calificacion: calificacionActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaCalificacion = async (req, resp = response) => {
  const calificacionId = req.params.id;
  try {
    const calificacion = await Calificacion.findByPk(calificacionId);
    if (!calificacion) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La Calificacion no existe" });
    }
    if (calificacion.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La calificacion ya se dio de baja anteriormente",
      });
    }
    const calificacionDeBaja = await Calificacion.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_calificacion: calificacionId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      calificacion: calificacionDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarCalificacion = async (req, resp = response) => {
  const calificacionId = req.params.id;
  try {
    const calificacion = await Calificacion.findByPk(calificacionId);
    if (!calificacion) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La Calificacion no existe" });
    }
    if (calificacion.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El calificacion primero debe darse de baja" });
    }
    const calificacionDeBaja = await Calificacion.destroy({
      returning: true,
      where: { id_calificacion: calificacionId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      calificacion: calificacionDeBaja,
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
  crearCalificacion,
  obtenerCalificaciones,
  obtenerCalificacionPorNombre,
  actualizarCalificacion,
  darDeBajaCalificacion,
  eliminarCalificacion,
};
