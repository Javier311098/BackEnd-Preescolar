const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearRole,
  obtenerRoles,
  actualizarRole,
  darDeBajaRole,
  eliminarRole,
} = require("../controllers/rolesController");

const validarRole = [
  check("rol", "Se debe registrar el nuevo nombre del rol").not().isEmpty(),
  validarCampos,
];

router.post("/", validarRole, crearRole);
router.get("/", obtenerRoles);
router.put("/:id", validarRole, actualizarRole);
router.put("/baja/:id", darDeBajaRole);
router.delete("/:id", eliminarRole);

module.exports = router;
