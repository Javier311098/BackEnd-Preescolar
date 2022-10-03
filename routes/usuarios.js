const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  getUsuario,
} = require("../controllers/usuarioController");

const validadorUsuario = [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("email", "La fecha de inicio es obligatoria").isEmail(),
  check(
    "password",
    "El password debe de ser de al menos 6 caracteres"
  ).isLength({
    min: 6,
  }),
  check("role_id", "El role debe ser registrado y numerico")
    .isDecimal()
    .not()
    .isEmpty(),
  validarCampos,
];

router.post("/", validadorUsuario, crearUsuario);
// router.get("/", getUsuarios);
// router.get("/:id", getUsuario);
// router.put("/:id", validadorUsuario, actualizarUsuario);
// router.delete("/:id", eliminarUsuario);
// router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
