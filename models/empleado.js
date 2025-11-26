const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  password: String
});

module.exports = mongoose.model("empleados", empleadoSchema);
