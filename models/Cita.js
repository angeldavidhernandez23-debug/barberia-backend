const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
  nombreCliente: { type: String, required: true },
  servicios: { type: [String], required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  completada: { type: Boolean, default: false }
});

module.exports = mongoose.model("Cita", citaSchema);
