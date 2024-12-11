const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todos las colonias
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM colonia");
  res.json(rows);
});

// Agregar una colonia
router.post("/", async (req, res) => {
  const { nombre_colonia } = req.body;
  await pool.query("INSERT INTO colonia (nombre_colonia) VALUES (?)", [
    nombre_colonia,
  ]);
  res.status(201).send("Colonia agregada");
});

// Actualizar una colonia
router.put("/:id", async (req, res) => {
  const { nombre_colonia } = req.body;
  const { id } = req.params;
  await pool.query(
    "UPDATE colonia SET nombre_colonia = ? WHERE id_colonia = ?",
    [nombre_colonia, id]
  );
  res.send("Colonia actualizada");
});

// Eliminar una colonia
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM colonia WHERE id_colonia = ?", [id]);
  res.send("Colonia eliminada");
});

module.exports = router;
