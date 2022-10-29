const { response } = require("express");
const { Op } = require("sequelize");
const Clase = require("../models/Clase");

const crearClase = async (req, resp = response) => {
  const { id_esdo, id_materia, id_grado, id_periodo } = req.body;
  try {
    let clase = await Clase.findOne({
      where: { id_esdo: id_esdo },
    });
    if (!clase) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe los usuarios",
      });
    }
    clase = await Clase.findOne({
      where: { id_materia: id_materia },
    });
    if (!clase) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe la materia",
      });
    }
    clase = await Clase.findOne({
      where: { id_grado: id_grado },
    });
    if (!clase) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe la materia",
      });
    }
    clase = await Clase.findOne({
      where: { id_periodo: id_periodo },
    });
    if (!clase) {
      return resp.status(400).json({
        ok: false,
        msg: "No existe la materia",
      });
    }

    clase = new Clase(req.body);
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
  let clases = await Clase.findAll();
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
    const nuevaclase = { ...req.body };

    const claseActualizada = await Clase.update(nuevaclase, {
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
  actualizarClase,
  darDeBajaClase,
  eliminarClase,
};
