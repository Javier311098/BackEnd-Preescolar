const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearGrado,
  obtenerGrados,
  actualizarGrado,
  darDeBajaGrado,
  eliminarGrado,
} = require("../controllers/gradosController");
const { validarJWT } = require("../middlewares/validar-jwt");

const validarGrado = [
  check("nombre_grado", "El grado debe tener un nombre").not().isEmpty(),
  validarCampos,
];

// router.use(validarJWT);
router.post("/", validarGrado, crearGrado);
router.get("/:roleId", obtenerGrados);
router.put("/:id", validarGrado, actualizarGrado);
router.put("/baja/:id", darDeBajaGrado);
router.delete("/:id", eliminarGrado);

module.exports = router;
