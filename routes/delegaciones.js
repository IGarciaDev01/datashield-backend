const express = require("express");
const pool = require("../db");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth.js");

// Obtener todos las delegaciones
router.get("/", authenticateToken, authorizeRole([1, 2]), async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM delegacion");
  res.json(rows);
});

// Agregar una delegacion
router.post("/", authenticateToken, authorizeRole([1]), async (req, res) => {
  const { nombre_delegacion } = req.body;
  await pool.query("INSERT INTO delegacion (nombre_delegacion) VALUES (?)", [
    nombre_delegacion,
  ]);
  res.status(201).send("Delegación agregada");
});

// Actualizar una delegación
router.put("/:id", authenticateToken, authorizeRole([1]), async (req, res) => {
  const { nombre_delegacion } = req.body;
  const { id } = req.params;
  await pool.query(
    "UPDATE delegacion SET nombre_delegacion = ? WHERE id_delegacion = ?",
    [nombre_delegacion, id]
  );
  res.send("Delegación actualizada");
});

// Eliminar una delegación
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole([1]),
  async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM delegacion WHERE id_delegacion = ?", [id]);
    res.send("Delegacion eliminada");
  }
);

module.exports = router;
