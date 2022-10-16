const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearAdministrador,
  obtenerAdministradores,
  obtenerAdministradorPorNombre,
  actualizarAdministrador,
  eliminarAdministrador,
} = require("../controllers/administradorController");

const validadorAdministrador = [
  check("nombre_admin", "Debe registrarse el nombre del administrador")
    .not()
    .isEmpty()
    .isLength({ min: 4 }),
  check("telefono_admin", "Debe registrarse el telefono del administrador")
    .not()
    .isEmpty()
    .isLength({ max: 100 }),
  check("correo_admin", "El correo es obligatorio y debe ser un correo valido")
    .isEmail()
    .isLength({ max: 100 }),
  check(
    "password_admin",
    "El password debe de ser de al menos 6 caracteres"
  ).isLength({
    min: 6,
    max: 255,
  }),

  validarCampos,
];

router.post("/", validadorAdministrador, crearAdministrador);
router.get("/", obtenerAdministradores);
router.get("/:nombre", obtenerAdministradorPorNombre);
router.put("/:id", validadorAdministrador, actualizarAdministrador);
router.delete("/:id", eliminarAdministrador);
// router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
