const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Middleware de autenticación
function authenticateToken(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Token requerido");
    const tokenValue = token.split(" ")[1];
    jwt.verify(tokenValue, jwtSecret, (err, user) => {
      if (err) return res.status(403).send("Token no válidos");
      req.user = user;
      console.log("user:", user);
      next();
    });
  } catch (error) {
    console.log("err:", error);
  }
}

// Middleware para verificar el rol (Admin)
function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res
        .status(403)
        .send("No tienes permiso para realizar esta acción");
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
