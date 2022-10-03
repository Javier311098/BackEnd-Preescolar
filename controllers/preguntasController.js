const { response } = require("express");
const Pregunta = require("../models/Pregunta");

const crearPregunta = async (req, resp = response) => {
  const { preguntaHecha } = req.body;
  try {
    let pregunta = await Pregunta.findOne({
      where: { preguntaHecha: preguntaHecha },
    });
    if (pregunta) {
      return resp.status(400).json({
        ok: false,
        msg: "Ya existe la pregunta",
      });
    }
    pregunta = new Pregunta(req.body);
    await pregunta.save();
    resp.status(201).json({
      ok: true,
      id: pregunta.id,
      preguntaHecha: pregunta.preguntaHecha,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: "Por favor comuniquese con el administrador",
    });
  }
};

const ObtenerPreguntas = async (req, res = response) => {
  let preguntas = await Pregunta.findAndCountAll();

  res.json({
    ok: true,
    preguntas,
  });
};

module.exports = {
  crearPregunta,
  ObtenerPreguntas,
};
