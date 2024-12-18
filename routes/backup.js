const express = require("express");
const fs = require("fs");
const archiver = require("archiver");
const pool = require("../db");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.js");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRole([1]), // Solo usuarios con rol 1 pueden hacer respaldos
  async (req, res) => {
    try {
      // Obtener todas las tablas de la base de datos
      const [tables] = await pool.query("SHOW TABLES");
      const tableNames = tables.map((row) => Object.values(row)[0]);

      let sqlBackup = "";

      for (const table of tableNames) {
        // Crear sentencias para la estructura de las tablas
        const [createTable] = await pool.query(
          `SHOW CREATE TABLE \`${table}\``
        );
        sqlBackup += createTable[0]["Create Table"] + ";\n\n";

        // Agregar datos de cada tabla
        const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
        rows.forEach((row) => {
          const values = Object.values(row)
            .map((value) =>
              value === null
                ? "NULL"
                : `'${value.toString().replace(/'/g, "\\'")}'`
            )
            .join(", ");
          sqlBackup += `INSERT INTO \`${table}\` VALUES (${values});\n`;
        });
        sqlBackup += "\n\n";
      }

      // Guardar el respaldo en un archivo temporal
      const backupFilePath = "backup.sql";
      fs.writeFileSync(backupFilePath, sqlBackup);

      // Crear un archivo ZIP con el respaldo
      const zipFilePath = "backup.zip";
      const zip = archiver("zip");
      const output = fs.createWriteStream(zipFilePath);

      zip.pipe(output);
      zip.file(backupFilePath, { name: "backup.sql" });
      await zip.finalize();

      // Enviar el archivo ZIP como respuesta
      res.download(zipFilePath, "backup.zip", () => {
        // Eliminar archivos temporales
        fs.unlinkSync(backupFilePath);
        fs.unlinkSync(zipFilePath);
      });
    } catch (error) {
      console.error("Error al generar el respaldo:", error);
      res.status(500).send("Error al generar el respaldo");
    }
  }
);

module.exports = router;
