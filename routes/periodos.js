const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearPeriodo,
  obtenerPeriodos,
  actualizarPeriodo,
  darDeBajaPeriodo,
  eliminarPeriodo,
} = require("../controllers/periodosController");
const { isDate } = require("../helpers/isDate");

const validarPeriodo = [
  check("nombre_periodo", "El periodo debe tener un nombre")
    .not()
    .isEmpty()
    .isLength({ max: 100 }),
  check("inicio_periodo", "El periodo debe tener una fecha de inicio").custom(
    isDate
  ),
  check("fin_periodo", "El periodo debe tener una fecha de fin").custom(isDate),
  validarCampos,
];

const validacionDeMateriaId = [
  check("id_materia", "Debe ser un numero entero y no estar vacio")
    .notEmpty()
    .isInt(),
  validarCampos,
];

router.post("/", validarPeriodo, crearPeriodo);
router.get("/:roleId", obtenerPeriodos);
router.put("/:id", validarPeriodo, actualizarPeriodo);
router.put("/baja/:id", darDeBajaPeriodo);
router.delete("/:id", eliminarPeriodo);

module.exports = router;
