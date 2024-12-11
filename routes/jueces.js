const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todos los jueces
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM juez");
  res.json(rows);
});

// Agregar un juez
router.post("/", async (req, res) => {
  const { nombre_juez } = req.body;
  const { tiempo_servicio } = req.body;
  await pool.query(
    "INSERT INTO juez (nombre_juez, tiempo_servicio) VALUES (?, ?)",
    [nombre_juez, tiempo_servicio]
  );
  res.status(201).send("Juez agregado");
});

// Actualizar un juez
router.put("/:id", async (req, res) => {
  const { nombre_juez } = req.body;
  const { id } = req.params;
  await pool.query("UPDATE juez SET nombre_juez = ? WHERE id_juez = ?", [
    nombre_juez,
    id,
  ]);
  res.send("Juez actualizado");
});

// Eliminar un juez
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM juez WHERE id_juez = ?", [id]);
  res.send("Juez eliminado");
});

module.exports = router;