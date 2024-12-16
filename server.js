require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("./db.js");
const callesRouter = require("./routes/calles.js");
const coloniasRouter = require("./routes/colonias.js");
const delegacionesRouter = require("./routes/delegaciones.js");
const juecesRouter = require("./routes/jueces.js");
const vigilantesRouter = require("./routes/vigilantes.js");
const jwtSecret = process.env.JWT_KEY;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Ruta de registro de usuario
app.post("/register", async (req, res) => {
  const { name, email, password, rol } = req.body;

  // Verificar si el email ya existe
  const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (user.length > 0) {
    return res.status(400).send("El email ya está registrado");
  }

  // Cifrar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar el nuevo usuario en la base de datos
  const query =
    "INSERT INTO users (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)";
  await pool.query(query, [name, email, hashedPassword, rol]);

  res.status(201).send("Usuario registrado exitosamente");
});

// Login para obtener el token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  const [users] = await pool.query(query, [email]);

  if (!users || users.length === 0)
    return res.status(404).send("Usuario no encontrado");

  const user = users[0]; // El primer usuario que coincida

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send("Contraseña incorrecta");

  const token = jwt.sign(
    { id: user.id, name: user.nombre, rol: user.id_rol },
    jwtSecret
  );
  res.json({ token });
});

// Rutas
app.use("/api/calles", callesRouter);
app.use("/api/colonias", coloniasRouter);
app.use("/api/deleaciones", delegacionesRouter);
app.use("/api/jueces", juecesRouter);
app.use("/api/vigilantes", vigilantesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
