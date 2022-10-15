const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearMateria,
  obtenerMaterias,
  obtenerMateriaPorNombre,
  actualizarMateria,
  darDeBajaMateria,
  eliminarMateria,
} = require("../controllers/materiasController");

const validarMateria = [
  check("nombre_materia", "La materia debe tener un nombre").not().isEmpty(),
  check("descripcion", "La materia necesita una descripcion").not().isEmpty(),
  validarCampos,
];

router.post("/", validarMateria, crearMateria);
router.get("/", obtenerMaterias);
router.get("/:nombre", obtenerMateriaPorNombre);
router.put("/:id", validarMateria, actualizarMateria);
router.put("/baja/:id", darDeBajaMateria);
router.delete("/:id", eliminarMateria);

module.exports = router;
