const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearActividad,
  obtenerActividades,
  agregarUnaMateria,
  obtenerActividadPorNombre,
  actualizarActividad,
  darDeBajaActividad,
  eliminarActividad,
} = require("../controllers/actividadesController");

const validarActividad = [
  check("nombre_actividad", "La actividad debe tener un nombre")
    .not()
    .isEmpty()
    .isLength({ max: 100 }),
  check("material", "La actividad debe tener materiales")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 100 }),
  check("video", "El video debe ser texto y no debe soprepasar 255 caracteres")
    .isString()
    .optional({ nullable: true })
    .isLength({ max: 255 }),
  check("objectivo", "La actividad debe tener un objectivo")
    .not()
    .isEmpty()
    .isLength({ min: 10, max: 255 }),
  check("instrucciones", "La actividad debe tener instrucciones")
    .not()
    .isEmpty()
    .isLength({ min: 10, max: 255 }),
  check("id_materia", "Debe ser un numero entero")
    .isInt()
    .optional({ nullable: true }),
  validarCampos,
];

const validacionDeMateriaId = [
  check("id_materia", "Debe ser un numero entero y no estar vacio")
    .notEmpty()
    .isInt(),
  validarCampos,
];

router.post("/", validarActividad, crearActividad);
router.get("/", obtenerActividades);
router.put("/materia/:id", validacionDeMateriaId, agregarUnaMateria);
router.get("/:nombre", obtenerActividadPorNombre);
router.put("/:id", validarActividad, actualizarActividad);
router.put("/baja/:id", darDeBajaActividad);
router.delete("/:id", eliminarActividad);

module.exports = router;
