const jwt = require("jsonwebtoken");

const generarJWT = (uid, name, role) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name, role };
    jwt.sign(
      payload,
      process.env.SECRET_JWT,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("no se pudo generar el token");
        }
        resolve(token);
      }
    );
  });
};

module.exports = { generarJWT };
