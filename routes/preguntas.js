const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearPregunta,
  ObtenerPreguntas,
} = require("../controllers/preguntasController");

const validadorUsuario = [
  check("preguntaHecha", "La pregunta no debe estar vacia").not().isEmpty(),
  validarCampos,
];

router.post("/", validadorUsuario, crearPregunta);
router.get("/", ObtenerPreguntas);

module.exports = router;
