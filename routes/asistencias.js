const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearAsistencia,
  obtenerAsistencias,
  obtenerAsistenciaClase,
  actualizarAsistencia,
  darDeBajaAsistencia,
  eliminarAsistencia,
} = require("../controllers/asistenciasController");

const validarAsistencia = [
  check("id_clase", "Se debe registrar una clase").not().isEmpty().isInt(),
  check("asistencia", "Se debe registrar la asistencia")
    .not()
    .isEmpty()
    .isInt(),
  validarCampos,
];

router.post("/", validarAsistencia, crearAsistencia);
router.get("/", obtenerAsistencias);
router.get("/:id", obtenerAsistenciaClase);
router.put("/:id", validarAsistencia, actualizarAsistencia);
router.put("/baja/:id", darDeBajaAsistencia);
router.delete("/:id", eliminarAsistencia);

module.exports = router;
