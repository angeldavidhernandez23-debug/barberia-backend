const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --- Inicializar app ---
const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(cors());

// --- Conexión a MongoDB Atlas ---
mongoose.connect(
  "mongodb+srv://angeldavidhernandez23_db_user:St2nXwPb0RQc3IAg@cluster0.rvynwvf.mongodb.net/barberia?retryWrites=true&w=majority"
)
.then(() => console.log("✔ Conectado a MongoDB Atlas"))
.catch(err => console.log("❌ Error al conectar:", err));

// --- MODELOS ---
// Modelo Cliente/Usuario
const Usuario = mongoose.model("usuarios", {
  nombre: String,
  email: String,
  password: String
});

// IMPORTACIÓN CORRECTA DEL MODELO EMPLEADO
// Debe coincidir EXACTAMENTE con el nombre del archivo en /models/
const Empleado = require("./models/empleado");

// ---------------------
//   RUTAS USUARIOS
// ---------------------
app.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existente = await Usuario.findOne({ email });
    if (existente)
      return res.json({ ok: false, mensaje: "El correo ya está registrado" });

    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    res.json({ ok: true, mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: "Error interno" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email, password });
    if (!usuario)
      return res.json({ ok: false, mensaje: "Correo o contraseña incorrectos" });

    res.json({ ok: true, nombre: usuario.nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: "Error interno" });
  }
});

// ---------------------
//   RUTAS EMPLEADOS
// ---------------------
app.post("/empleados", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password)
      return res.status(400).json({ ok: false, mensaje: "Faltan datos" });

    const existente = await Empleado.findOne({ correo });
    if (existente)
      return res.json({ ok: false, mensaje: "Correo ya registrado" });

    const nuevoEmpleado = new Empleado({ nombre, correo, password });
    await nuevoEmpleado.save();

    res.json({ ok: true, empleadoId: nuevoEmpleado._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: "Error interno" });
  }
});

// LOGIN EMPLEADO
app.post("/login-empleado", async (req, res) => {
  try {
    const { email, password } = req.body;

    const empleado = await Empleado.findOne({ correo: email, password });

    if (!empleado)
      return res.json({ ok: false, mensaje: "Empleado no encontrado" });

    res.json({ ok: true, nombre: empleado.nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: "Error interno" });
  }
});
app.get("/empleados/lista", async (req, res) => {
  const empleados = await Empleado.find();
  res.json(empleados);
});


// ---------------------
//   RUTAS CITAS
// ---------------------
app.use("/citas", require("./routes/citas"));
// --- INICIAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
