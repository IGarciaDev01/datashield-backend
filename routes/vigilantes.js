const express = require("express");
const pool = require("../db");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth.js");

// Obtener todos los vigilantes
router.get("/", authenticateToken, authorizeRole([1, 2]), async (req, res) => {
  const query = `
  SELECT 
    v.id_vigilante, 
    v.nombre_vigilante, 
    v.apellidos_vigilante, 
    v.numero_domicilio_vigilante, 
    v.codigo_postal_vigilante, 
    v.numero_vigilante, 
    v.edad_vigilante,
    v.armado,
    c.nombre_calle,
    co.nombre_colonia,
    d.nombre_delegacion

  FROM entidad v
  JOIN calle c ON v.vigilante_id_calle = c.id_calle
  JOIN colonia co ON v.vigilante_id_colonia = co.id_colonia
  JOIN delegacion d ON v.vigilante_id_delegacion = d.id_delegacion;
`;
  const [rows] = await pool.query(query);
  res.json(rows);
});

// Agregar un vigilante
router.post("/", authenticateToken, authorizeRole([1]), async (req, res) => {
  const {
    nombre_vigilante,
    apellidos_vigilante,
    numero_domicilio_vigilante,
    codigo_postal_vigilante,
    numero_vigilante,
    edad_vigilante,
    armado,
    vigilante_id_calle,
    vigilante_id_colonia,
    vigilante_id_delegacion,
  } = req.body;

  const query = `
  INSERT INTO vigilante (
    nombre_vigilante,
    apellidos_vigilante,
    numero_domicilio_vigilante,
    codigo_postal_vigilante,
    numero_vigilante,
    edad_vigilante,
    armado,
    vigilante_id_calle,
    vigilante_id_colonia,
    vigilante_id_delegacion,
  ) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  await pool.query(query, [
    nombre_vigilante,
    apellidos_vigilante,
    numero_domicilio_vigilante,
    codigo_postal_vigilante,
    numero_vigilante,
    edad_vigilante,
    armado,
    vigilante_id_calle,
    vigilante_id_colonia,
    vigilante_id_delegacion,
  ]);
  res.status(201).send("Vigilante agregado");
});

// Actualizar un vigilante
router.put("/:id", authenticateToken, authorizeRole([1]), async (req, res) => {
  const {
    nombre_vigilante,
    apellidos_vigilante,
    numero_domicilio_vigilante,
    codigo_postal_vigilante,
    numero_vigilante,
    edad_vigilante,
    armado,
    vigilante_id_calle,
    vigilante_id_colonia,
    vigilante_id_delegacion,
  } = req.body;
  const { id } = req.params;

  const query = `
  UPDATE vigilante
  SET 
   nombre_vigilante = ?,
    apellidos_vigilante = ?,
    numero_domicilio_vigilante = ?,
    codigo_postal_vigilante = ?,
    numero_vigilante = ?,
    edad_vigilante = ?,
    armado = ?,
    vigilante_id_calle = ?,
    vigilante_id_colonia = ?,
    vigilante_id_delegacion = ?,
  WHERE id_vigilante = ?
`;

  await pool.query(query, [
    nombre_vigilante,
    apellidos_vigilante,
    numero_domicilio_vigilante,
    codigo_postal_vigilante,
    numero_vigilante,
    edad_vigilante,
    armado,
    vigilante_id_calle,
    vigilante_id_colonia,
    vigilante_id_delegacion,
    id,
  ]);
  res.send("Vigilante actualizado");
});

// Eliminar una colonia
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole([1]),
  async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM vigilante WHERE id_vigilante = ?", [id]);
    res.send("Vigilante eliminado");
  }
);

module.exports = router;
