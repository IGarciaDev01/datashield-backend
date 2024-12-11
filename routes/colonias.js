const express = require("express");
const pool = require("../db");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth.js");

// Obtener todos las colonias
router.get("/", authenticateToken, authorizeRole([1, 2]), async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM colonia");
  res.json(rows);
});

// Agregar una colonia
router.post("/", authenticateToken, authorizeRole([1]), async (req, res) => {
  const { nombre_colonia } = req.body;
  await pool.query("INSERT INTO colonia (nombre_colonia) VALUES (?)", [
    nombre_colonia,
  ]);
  res.status(201).send("Colonia agregada");
});

// Actualizar una colonia
router.put("/:id", authenticateToken, authorizeRole([1]), async (req, res) => {
  const { nombre_colonia } = req.body;
  const { id } = req.params;
  await pool.query(
    "UPDATE colonia SET nombre_colonia = ? WHERE id_colonia = ?",
    [nombre_colonia, id]
  );
  res.send("Colonia actualizada");
});

// Eliminar una colonia
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole([1]),
  async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM colonia WHERE id_colonia = ?", [id]);
    res.send("Colonia eliminada");
  }
);

module.exports = router;
