const router = require("express").Router();
const Horario = require("../models/Horario");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/crear", async (req, res) => {
    try {
        const { grupoId, dia, horaInicio, horaFin, toleranciaMin } = req.body;

        if (!grupoId || !dia || !horaInicio || !horaFin || toleranciaMin == null) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const horario = new Horario({
            grupoId,
            dia: String(dia).toLowerCase(),
            horaInicio,
            horaFin,
            toleranciaMin
        });

        await horario.save();

        res.json(horario);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

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

        res.json(horarios);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;