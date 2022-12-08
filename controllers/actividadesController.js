const { response } = require("express");
const { Op } = require("sequelize");

const Actividad = require("../models/Actividad");
const Materia = require("../models/Materia");

const crearActividad = async (req, resp = response) => {
  const { nombre_actividad } = req.body;
  const imagen = req.body.imagen_1;
  try {
    let actividad = await Actividad.findOne({
      where: { nombre_actividad: nombre_actividad },
    });
    if (actividad) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe la actividad",
      });
    }
    actividad = new Actividad({ ...req.body, estatus: 1 });
    await actividad.save();
    console.log(imagen);
    resp.status(201).json({
      ok: true,
      actividad: actividad,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const obtenerActividades = async (req, res = response) => {
  const { roleId } = req.params;
  let actividades;
  if (parseInt(roleId) !== 1) {
    actividades = await Actividad.findAll({ where: { estatus: 1 } });
  } else {
    actividades = await Actividad.findAll();
  }
  res.json({
    ok: true,
    actividades,
  });
};

const obtenerActividadPorId = async (req, resp = response) => {
  const { id } = req.params;
  try {
    const actividadEncontrada = await Actividad.findOne({
      where: { [Op.and]: [{ id_actividad: id }, { estatus: 1 }] },
    });
    if (!actividadEncontrada) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La actividad no se encontro con ese id" });
    }
    resp.json({ ok: true, actividad: actividadEncontrada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const actualizarActividad = async (req, resp = response) => {
  const actividadId = req.params.id;
  try {
    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La actividad no existe" });
    }

    const nuevaActividad = { ...req.body };

    const actividadActualizada = await Actividad.update(nuevaActividad, {
      returning: true,
      where: { id_actividad: actividadId },
    });

    resp.json({ ok: true, actividad: actividadActualizada });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const subirArchivo = async (req, resp = response) => {
  const { actividad, materia } = req.params;

  try {
    const actividadCarpeta = actividad.replace(/\s+/g, "-");
    const materiaCarpeta = materia.replace(/\s+/g, "-");
    const respuesta = `/${materiaCarpeta.toLowerCase()}/${actividadCarpeta.toLowerCase()}/`;
    resp.json({ ok: true, ruta: respuesta });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

const darDeBajaActividad = async (req, resp = response) => {
  const actividadId = req.params.id;
  try {
    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La actividad no existe" });
    }
    if (actividad.estatus === 0) {
      return resp.status(404).json({
        ok: false,
        msg: "La actividad ya se dio de baja anteriormente",
      });
    }
    const actividadDeBaja = await Actividad.update(
      { ...req.body, estatus: 0 },
      {
        returning: true,
        where: { id_actividad: actividadId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se dio de baja correctamente",
      actividad: actividadDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarActividad = async (req, resp = response) => {
  const actividadId = req.params.id;
  try {
    const actividad = await Actividad.findByPk(actividadId);
    if (!actividad) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La actividad no existe" });
    }
    if (actividad.estatus !== 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "El actividad primero debe darse de baja" });
    }
    const actividadDeBaja = await Actividad.destroy({
      returning: true,
      where: { id_actividad: actividadId },
    });
    resp.json({
      ok: true,
      msg: "Se elimino correctamente",
      actividad: actividadDeBaja,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const agregarUnaMateria = async (req, resp = response) => {
  const actividadId = req.params.id;
  const { id_materia } = req.body;

  try {
    const materia = await Materia.findByPk(id_materia);
    const actividad = await Actividad.findByPk(actividadId);
    if (!materia || materia.estatus === 0) {
      return resp.status(404).json({ ok: false, msg: "La materia no existe" });
    }
    if (!actividad || actividad.estatus === 0) {
      return resp
        .status(404)
        .json({ ok: false, msg: "La actividad no existe" });
    }
    Actividad.update(
      {
        ...actividad,
        id_materia,
      },
      {
        returning: true,
        where: { id_actividad: actividadId },
      }
    );
    resp.json({
      ok: true,
      msg: "Se agrego correctamente la materia a la actividad",
      id_actividad: parseInt(actividadId),
      id_materia,
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
  crearActividad,
  obtenerActividades,
  obtenerActividadPorId,
  actualizarActividad,
  darDeBajaActividad,
  eliminarActividad,
  agregarUnaMateria,
  subirArchivo,
};
