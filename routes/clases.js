const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearClase,
  obtenerClases,
  obtenerClasePorMateria,
  actualizarClase,
  darDeBajaClase,
  eliminarClase,
  obtenerClasePorGrado,
} = require("../controllers/clasesController");

const validarClase = [
  // check("id_esdo", "Se debe registrar una estudiante y docente")
  //   .not()
  //   .isEmpty()
  //   .isInt(),
  check("id_grado", "Se debe registrar el grado").not().isEmpty().isInt(),
  check("id_periodo", "Se debe registrar el periodo").not().isEmpty().isInt(),
  check("id_actividad", "Se debe registrar la actividad")
    .not()
    .isEmpty()
    .isInt(),
  validarCampos,
];

router.post("/", validarClase, crearClase);
router.get("/", obtenerClases);
router.get("/:id", obtenerClasePorMateria);
router.get("/grado/:id", obtenerClasePorGrado);
router.put("/:id", validarClase, actualizarClase);
router.put("/baja/:id", darDeBajaClase);
router.delete("/:id", eliminarClase);

module.exports = router;
