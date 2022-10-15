const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearGrado,
  obtenerGrados,
  obtenerGradoPorNombre,
  actualizarGrado,
  darDeBajaGrado,
  eliminarGrado,
} = require("../controllers/gradosController");

const validarGrado = [
  check("nombre_grado", "El grado debe tener un nombre").not().isEmpty(),
  validarCampos,
];

router.post("/", validarGrado, crearGrado);
router.get("/", obtenerGrados);
router.get("/:nombre", obtenerGradoPorNombre);
router.put("/:id", validarGrado, actualizarGrado);
router.put("/baja/:id", darDeBajaGrado);
router.delete("/:id", eliminarGrado);

module.exports = router;
