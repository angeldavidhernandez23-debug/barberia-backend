const mongoose = require("mongoose");

const CitaSchema = new mongoose.Schema({
  nombreCliente: String,
  fecha: String,
  hora: String,
  servicios: String
});

module.exports = mongoose.model("Cita", CitaSchema);
