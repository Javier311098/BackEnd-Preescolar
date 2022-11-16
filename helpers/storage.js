const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const { actividad, materia } = req.params;
    const dir = "./imagenes";
    const actividadCarpeta = actividad.replace(/\s+/g, "-");
    const materiaCarpeta = materia.replace(/\s+/g, "-");
    const ruta = `${dir}/${materiaCarpeta.toLowerCase()}/${actividadCarpeta.toLowerCase()}`;
    if (!fs.existsSync(ruta)) {
      fs.mkdirSync(ruta, { recursive: true });
    }
    callback(null, ruta);
  },
  filename: (req, file, callback) => {
    const ext = file.originalname.split(".").pop();
    callback(null, `imagen1.${ext}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
