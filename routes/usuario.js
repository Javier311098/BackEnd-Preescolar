const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearUsuario,
  loginUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorNombre,
  actualizarUsuario,
  eliminarUsuario,
  darDeBajaUsuario,
  relacionarEstudianteTutores,
  obtenerUsuarioRol,
  relacionarEstudianteDocente,
  revalidarToken,
} = require("../controllers/usuarioController");
const { validarJWT } = require("../middlewares/validar-jwt");

const validadorUsuario = [
  check("nombre_usuario", "Debe registrarse el nombre del usuario")
    .not()
    .isEmpty()
    .isLength({ min: 4 }),
  check("direccion_residencia", "Debe registrarse la direccion del usuario")
    .not()
    .isEmpty()
    .isLength({ max: 100 }),
  check(
    "telefono_emergencia_1",
    "Debe registrarse el telefono de emergencia  del usuario"
  )
    .not()
    .isEmpty()
    .isLength({ max: 100 }),
  check("edad", "Debe registrarse la edad del usuario").not().isEmpty().isInt(),

  validarCampos,
];

const validadorRelacionTutor = [
  check("id_usuario_estudiante", "Debe agregarse un estudiante").isInt(),
  check("id_usuario_tutor", "Debe agregarse un tutor").isInt(),
];

const validadorRelacionDocente = [
  check("id_usuario_estudiante", "Debe agregarse un estudiante").isInt(),
  check("id_usuario_tutor", "Debe agregarse un docente").isInt(),
];

const validationLogin = [
  check("correo_electronico", "el correo es obligatorio").isEmail(),
  check("password_usuario", "el password debe ser el correcto").isLength({
    min: 6,
  }),
  validarCampos,
];

router.post("/", validadorUsuario, crearUsuario);
router.post("/login", validationLogin, loginUsuario);
router.get("/renew", validarJWT, revalidarToken);
router.get("/", obtenerUsuarios);
router.get("/rol/:id", obtenerUsuarioRol);
router.get("/:nombre", obtenerUsuarioPorNombre);
router.put("/baja/:id", darDeBajaUsuario);
router.put("/:id", validadorUsuario, actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.post(
  "/relacion/tutor",
  validadorRelacionTutor,
  relacionarEstudianteTutores
);
router.post(
  "/relacion/docente",
  validadorRelacionDocente,
  relacionarEstudianteDocente
);

module.exports = router;