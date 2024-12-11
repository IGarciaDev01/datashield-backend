require("dotenv").config();
const express = require("express");
const cors = require("cors");
const callesRouter = require("./routes/calles.js");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rutas
app.use("/api/calles", callesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
