const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = function(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(401).send("Acceso denegado");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(400).send("Token inválido");
    }
};