const { response } = require("express");
const { Op } = require("sequelize");
const Asistencia = require("../models/Asistencia");

const crearAsistencia = async (req, resp = response) => {
  const { id_clase } = req.body;
  try {
    let asistencia = await Asistencia.findOne({
      where: { id_clase: id_clase },
    });

    if (!asistencia) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe la clase",
      });
    }
    asistencia = new Asistencia(req.body);
    await asistencia.save();
    resp.status(201).json({
      ok: true,
      asistencia: asistencia,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerAsistencias = async (req, res = response) => {
  let asistencias = await Asistencia.findAll();
  res.json({
    ok: true,
    asistencias,
  });
};

const obtenerAsistenciaClase = async (req, resp = response) => {
  const { id } = req.params;
  try {
    const asistenciaEncontrada = await Asistencia.findOne({
      where: { [Op.and]: [{ id_clase: id }, { estatus: 1 }] },
    });
    if (!asistenciaEncontrada) {
      return resp.status(404).json({
        ok: false,
        msg: "La asistencia no se encontro para esa clase",
      });
    }
    resp.json({ ok: true, asistencia: asistenciaEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarAsistencia = async (req, resp = response) => {
  const asistenciaId = req.params.id;

  try {
    const asistencia = await Asistencia.findByPk(asistenciaId);
    if (!asistencia) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La asistencia no existe" });
    }
    if (asistencia.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La asistencia no se encontro",
      });
    }
    const nuevaAsistencia = { ...req.body };

    const asistenciaActualizada = await Asistencia.update(nuevaAsistencia, {
      returning: true,
      where: { id_asistencia: asistenciaId },
    });

    resp.json({ ok: true, asistencia: asistenciaActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaAsistencia = async (req, resp = response) => {
  const asistenciaId = req.params.id;
  try {
    const asistencia = await Asistencia.findByPk(asistenciaId);
    if (!asistencia) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La asistencia no existe" });
    }
    if (asistencia.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La Asistencia ya se dio de baja anteriormente",
      });
    }
    const asistenciaDeBaja = await Asistencia.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_asistencia: asistenciaId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      asistencia: asistenciaDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarAsistencia = async (req, resp = response) => {
  const asistenciaId = req.params.id;
  try {
    const asistencia = await Asistencia.findByPk(asistenciaId);
    if (!asistencia) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La asistencia no existe" });
    }
    if (asistencia.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La asistencia primero debe darse de baja" });
    }
    const asistenciaDeBaja = await Asistencia.destroy({
      returning: true,
      where: { id_asistencia: asistenciaId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      asistencia: asistenciaDeBaja,
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
  crearAsistencia,
  obtenerAsistencias,
  obtenerAsistenciaClase,
  actualizarAsistencia,
  darDeBajaAsistencia,
  eliminarAsistencia,
};
