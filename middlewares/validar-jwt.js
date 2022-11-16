const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, resp = response, next) => {
  //x-token de los headers
  const token = req.header("x-token");
  if (!token) {
    return resp.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }
  try {
    const { uid, name, role } = jwt.verify(token, process.env.SECRET_JWT);
    req.uid = uid;
    req.name = name;
    req.role = role;
  } catch (error) {
    return resp.status(401).json({
      ok: false,
      msg: "token no valido",
    });
  }
  next();
};

module.exports = {
  validarJWT,
};
