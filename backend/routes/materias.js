const router = require("express").Router();
const Horario = require("../models/Horario");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/", async (req, res) => {
    try {
        const { apikey } = req.body;

        if (!apikey) {
            return res.status(400).json({ error: "Falta apikey" });
        }

        let decoded;
        try {
            decoded = jwt.verify(apikey, JWT_SECRET);
        } catch {
            return res.status(401).json({ error: "Token inválido" });
        }

        const alumno = await Usuario.findById(decoded.id);

        if (!alumno || !alumno.grupoId) {
            return res.status(404).json({ error: "Alumno sin grupo" });
        }

        const horarios = await Horario.find({ grupoId: alumno.grupoId });

        res.json([
            {
                materia: "Base de datos",
                horarios: horarios.map(h => ({
                    dia: h.dia,
                    horaInicial: h.horaInicio,
                    horaFinal: h.horaFin
                }))
            }
        ]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;