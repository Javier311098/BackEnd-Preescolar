const { response } = require("express");
const { Op } = require("sequelize");
const Grado = require("../models/grado");

const crearGrado = async (req, resp = response) => {
  const { nombre_grado } = req.body;
  try {
    let grado = await Grado.findOne({
      where: { nombre_grado: nombre_grado },
    });
    if (grado) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe el grado",
      });
    }
    grado = new Grado({ ...req.body, estatus: 1 });
    await grado.save();
    resp.status(201).json({
      ok: true,
      grado: { id_grado: grado.id_grado, nombre_grado: grado.nombre_grado },
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerGrados = async (req, res = response) => {
  const { roleId } = req.params;
  let grados;
  if (parseInt(roleId) !== 1) {
    grados = await Grado.findAll({ where: { estatus: 1 } });
  } else {
    grados = await Grado.findAll();
  }
  res.json({
    ok: true,
    grados,
  });
};

const actualizarGrado = async (req, resp = response) => {
  const gradoId = req.params.id;

  try {
    const grado = await Grado.findByPk(gradoId);
    if (!grado) {
      return resp.status(404).json({ ok: false, msg: "La grado no existe" });
    }
    const nuevagrado = { ...req.body };

    const gradoActualizada = await grado.update(nuevagrado, {
      returning: true,
      where: { id_grado: gradoId },
    });

    resp.json({ ok: true, grado: gradoActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaGrado = async (req, resp = response) => {
  const gradoId = req.params.id;
  try {
    const grado = await Grado.findByPk(gradoId);
    if (!grado) {
      return resp.status(404).json({ ok: false, msg: "El grado no existe" });
    }
    if (grado.estatus === 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El grado ya se dio de baja anteriormente" });
    }
    const gradoDeBaja = await Grado.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_grado: gradoId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      grado: gradoDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarGrado = async (req, resp = response) => {
  const gradoId = req.params.id;
  try {
    const grado = await Grado.findByPk(gradoId);
    if (!grado) {
      return resp.status(404).json({ ok: false, msg: "La grado no existe" });
    }
    if (grado.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El grado primero debe darse de baja" });
    }
    const gradoDeBaja = await Grado.destroy({
      returning: true,
      where: { id_grado: gradoId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      grado: gradoDeBaja,
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
  crearGrado,
  obtenerGrados,
  actualizarGrado,
  darDeBajaGrado,
  eliminarGrado,
};
