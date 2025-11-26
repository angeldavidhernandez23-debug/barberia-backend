const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// --- MODELO CITA ---
const Cita = mongoose.model("citas", {
  nombreCliente: String,
  servicios: String,
  fecha: String,
  hora: String,
  completada: { type: Boolean, default: false }
});

// ---------- RUTAS ----------

// Obtener todas las citas
router.get("/", async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json({ ok: true, citas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, mensaje:"Error interno" });
  }
});

// Buscar citas por nombre
router.get("/buscar/:nombre", async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const citas = await Cita.find({ nombreCliente: new RegExp(nombre, "i") });
    res.json({ ok:true, citas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, mensaje:"Error interno" });
  }
});

// Crear nueva cita
router.post("/", async (req, res) => {
  try {
    const { nombreCliente, servicios, fecha, hora } = req.body;
    if (!nombreCliente || !servicios || !fecha || !hora)
      return res.status(400).json({ ok:false, mensaje:"Faltan datos" });

    const nuevaCita = new Cita({ nombreCliente, servicios, fecha, hora });
    await nuevaCita.save();

    res.json({ ok:true, citaId: nuevaCita._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, mensaje:"Error interno" });
  }
});

// Actualizar cita (editar)
router.put("/:id", async (req, res) => {
  try {
    const { nombreCliente, servicios, fecha, hora, completada } = req.body;
    const cita = await Cita.findById(req.params.id);
    if (!cita) return res.status(404).json({ ok:false, mensaje:"Cita no encontrada" });

    // Actualizar campos
    if (nombreCliente) cita.nombreCliente = nombreCliente;
    if (servicios) cita.servicios = servicios;
    if (fecha) cita.fecha = fecha;
    if (hora) cita.hora = hora;
    if (completada !== undefined) cita.completada = completada;

    await cita.save();
    res.json({ ok:true, mensaje:"Cita actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, mensaje:"Error interno" });
  }
});

// Eliminar cita
router.delete("/:id", async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) return res.status(404).json({ ok:false, mensaje:"Cita no encontrada" });

    res.json({ ok:true, mensaje:"Cita eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, mensaje:"Error interno" });
  }
});

module.exports = router;
