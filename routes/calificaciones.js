const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearCalificacion,
  obtenerCalificaciones,
  obtenerCalificacionPorNombre,
  actualizarCalificacion,
  darDeBajaCalificacion,
  eliminarCalificacion,
  obtenerCalificacionesPorAlumnoYPeriodo,
} = require("../controllers/CalificacionesController");

const validarCalificacion = [
  check("id_periodo", "Se debe registrar periodo").not().isEmpty().isInt(),
  check("id_usuario", "Se debe registrar alumno").not().isEmpty().isInt(),
  check("calificacion", "Se debe registrar la calificacion").not().isEmpty(),
  check("id_materia", "Se debe registrar la materia").not().isEmpty().isInt(),

  validarCampos,
];

router.post("/", validarCalificacion, crearCalificacion);
router.get("/", obtenerCalificaciones);
router.get("/:nombre", obtenerCalificacionPorNombre);
router.get(
  "/alumno/:alumnoId/:periodoId/:roleId",
  obtenerCalificacionesPorAlumnoYPeriodo
);
router.put("/:id", validarCalificacion, actualizarCalificacion);
router.put("/baja/:id", darDeBajaCalificacion);
router.delete("/:id", eliminarCalificacion);

module.exports = router;
