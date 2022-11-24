const { response } = require("express");
const { Op } = require("sequelize");
const Actividad = require("../models/Actividad");
const Clase = require("../models/Clase");
const EstuDoce = require("../models/Estudiante_Docente");
const Grado = require("../models/Grado");
const Periodo = require("../models/Periodo");

const crearClase = async (req, resp = response) => {
  const { id_esdo, id_actividad, id_grado, id_periodo } = req.body;
  try {
    // let relacion = await EstuDoce.findOne({
    //   where: { id_esdo: id_esdo },
    // });
    // if (!relacion) {
    //   return resp.status(400).json({
    //     ok: false,
    //     msg: "No existe los usuarios",
    //   });
    // }
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
  let clases = await Clase.findAll({ where: { estatus: 1 } });
  let periodo = await Periodo.findByPk();
  let actividad = await Actividad.findByPk();
  let grado = await Grado.findByPk();

  res.json({
    ok: true,
    clases,
  });
};

const obtenerClasePorMateria = async (req, resp = response) => {
  const { id } = req.params;
  try {
    const claseEncontrada = await Clase.findAll({
      where: { [Op.and]: [{ id_materia: id }, { estatus: 1 }] },
    });
    if (!claseEncontrada) {
      return resp.status(404).json({
        ok: false,
        msg: "La clase no se encontro para esa materia",
      });
    }
    resp.json({ ok: true, clase: claseEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const obtenerClasePorGrado = async (req, resp = response) => {
  const { id } = req.params;
  try {
    const claseEncontrada = await Clase.findAll({
      where: { [Op.and]: [{ id_grado: id }, { estatus: 1 }] },
    });
    if (!claseEncontrada) {
      return resp.status(404).json({
        ok: false,
        msg: "La clase no se encontro para ese grupo",
      });
    }
    resp.json({ ok: true, clase: claseEncontrada });
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
    if (clase.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La clase no se encontro",
      });
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
  obtenerClasePorMateria,
  obtenerClasePorGrado,
  actualizarClase,
  darDeBajaClase,
  eliminarClase,
};
