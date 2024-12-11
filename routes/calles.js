const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todos las calles
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM calle");
  res.json(rows);
});

// Agregar una calle
router.post("/", async (req, res) => {
  const { nombre_calle } = req.body;
  await pool.query("INSERT INTO calle (nombre_calle) VALUES (?)", [
    nombre_calle,
  ]);
  res.status(201).send("Calle agregada");
});

// Actualizar una calle
router.put("/:id", async (req, res) => {
  const { nombre_calle } = req.body;
  const { id } = req.params;
  await pool.query("UPDATE calle SET nombre_calle = ? WHERE id_calle = ?", [
    nombre_calle,
    id,
  ]);
  res.send("Calle actualizada");
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM calle WHERE id_calle = ?", [id]);
  res.send("Calle eliminada");
});

module.exports = router;