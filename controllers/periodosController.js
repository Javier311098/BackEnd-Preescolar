const { response } = require("express");
const { Op } = require("sequelize");
const Periodo = require("../models/Periodo");

const crearPeriodo = async (req, resp = response) => {
  const { nombre_periodo } = req.body;
  try {
    let periodo = await Periodo.findOne({
      where: { nombre_periodo: nombre_periodo },
    });
    if (periodo) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe el periodo",
      });
    }
    periodo = new Periodo(req.body);
    await periodo.save();
    resp.status(201).json({
      ok: true,
      periodo: periodo,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerPeriodos = async (req, res = response) => {
  let periodos = await Periodo.findAll();
  res.json({
    ok: true,
    periodos,
  });
};

const obtenerPeriodoPorNombre = async (req, resp = response) => {
  const { nombre } = req.params;
  try {
    const periodoEncontrado = await Periodo.findOne({
      where: { [Op.and]: [{ nombre_periodo: nombre }, { estatus: 1 }] },
    });
    if (!periodoEncontrado) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El periodo no se encontro con ese nombre" });
    }
    resp.json({ ok: true, periodo: periodoEncontrado });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarPeriodo = async (req, resp = response) => {
  const periodoId = req.params.id;

  try {
    const periodo = await Periodo.findByPk(periodoId);
    if (!periodo) {
      return resp.status(404).json({ ok: false, msg: "El periodo no existe" });
    }
    if (periodo.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "El periodo no se encontro",
      });
    }
    const nuevoPeriodo = { ...req.body };

    const periodoActualizada = await Periodo.update(nuevoPeriodo, {
      returning: true,
      where: { id_periodo: periodoId },
    });

    resp.json({ ok: true, periodo: periodoActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaPeriodo = async (req, resp = response) => {
  const periodoId = req.params.id;
  try {
    const periodo = await Periodo.findByPk(periodoId);
    if (!periodo) {
      return resp.status(404).json({ ok: false, msg: "El periodo no existe" });
    }
    if (periodo.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "El periodo ya se dio de baja anteriormente",
      });
    }
    const periodoDeBaja = await Periodo.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_periodo: periodoId },
      }
    );
    resp.json({
      ok: true,
      msg: "El periodo se dio de baja correctamente",
      periodo: periodoDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarPeriodo = async (req, resp = response) => {
  const periodoId = req.params.id;
  try {
    const periodo = await Periodo.findByPk(periodoId);
    if (!periodo) {
      return resp.status(404).json({ ok: false, msg: "El periodo no existe" });
    }
    if (periodo.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El periodo primero debe darse de baja" });
    }
    const periodoDeBaja = await Periodo.destroy({
      returning: true,
      where: { id_periodo: periodoId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      periodo: periodoDeBaja,
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
  crearPeriodo,
  obtenerPeriodos,
  obtenerPeriodoPorNombre,
  actualizarPeriodo,
  darDeBajaPeriodo,
  eliminarPeriodo,
};
