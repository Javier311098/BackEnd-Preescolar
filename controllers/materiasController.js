const { response } = require("express");
const { Op } = require("sequelize");
const fs = require("fs");
const Materia = require("../models/Materia");

const crearMateria = async (req, resp = response) => {
  const { nombre_materia } = req.body;
  const dir = "./imagenes";
  try {
    let materia = await Materia.findOne({
      where: { nombre_materia: nombre_materia },
    });
    if (materia) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe la materia",
      });
    }
    materia = new Materia({ ...req.body, estatus: 1 });
    await materia.save();
    resp.status(201).json({
      ok: true,
      materia: materia,
    });

    const nombreCarpeta = materia.nombre_materia.replace(" ", "_");
    if (!fs.existsSync(`${dir}/${nombreCarpeta.toLowerCase()}`)) {
      fs.mkdirSync(`${dir}/${nombreCarpeta.toLowerCase()}`);
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerMaterias = async (req, res = response) => {
  let materias = await Materia.findAll({ where: { estatus: 1 } });
  res.json({
    ok: true,
    materias,
  });
};

const obtenerMateriaPorNombre = async (req, resp = response) => {
  const { nombre } = req.params;
  try {
    const materiaEncontrada = await Materia.findOne({
      where: { [Op.and]: [{ nombre_materia: nombre }, { estatus: 1 }] },
    });
    if (!materiaEncontrada) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La materia no se encontro con ese nombre" });
    }
    resp.json({ ok: true, materia: materiaEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarMateria = async (req, resp = response) => {
  const materiaId = req.params.id;
  const dir = "./imagenes";

  try {
    const materia = await Materia.findByPk(materiaId);
    if (!materia) {
      return resp.status(404).json({ ok: false, msg: "La materia no existe" });
    }
    const nuevaMateria = { ...req.body };

    const materiaActualizada = await Materia.update(nuevaMateria, {
      returning: true,
      where: { id_materia: materiaId },
    });

    resp.json({ ok: true, materia: materiaActualizada });
    const nombreCarpeta = nuevaMateria.nombre_materia.replace(" ", "_");
    if (!fs.existsSync(`${dir}/${nombreCarpeta.toLowerCase()}`)) {
      fs.mkdirSync(`${dir}/${nombreCarpeta.toLowerCase()}`);
    }
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaMateria = async (req, resp = response) => {
  const materiaId = req.params.id;
  try {
    const materia = await Materia.findByPk(materiaId);
    if (!materia) {
      return resp.status(404).json({ ok: false, msg: "La materia no existe" });
    }
    if (materia.estatus === 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La materia ya se dio de baja anteriormente" });
    }
    const materiaDeBaja = await Materia.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_materia: materiaId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      materia: materiaDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarMateria = async (req, resp = response) => {
  const materiaId = req.params.id;
  try {
    const materia = await Materia.findByPk(materiaId);
    if (!materia) {
      return resp.status(404).json({ ok: false, msg: "La materia no existe" });
    }
    if (materia.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La materia primero debe darse de baja" });
    }
    const materiaDeBaja = await Materia.destroy({
      returning: true,
      where: { id_materia: materiaId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      materia: materiaDeBaja,
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
  crearMateria,
  obtenerMaterias,
  obtenerMateriaPorNombre,
  actualizarMateria,
  darDeBajaMateria,
  eliminarMateria,
};
