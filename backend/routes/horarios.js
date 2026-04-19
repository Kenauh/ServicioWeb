const router = require("express").Router();
const Horario = require("../models/Horario");
const Usuario = require("../models/Usuario");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
    try {
        const { grupoId, dia, horaInicio, horaFin, toleranciaMin } = req.body;

        if (!grupoId || !dia || !horaInicio || !horaFin || toleranciaMin == null) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const horario = new Horario({
            grupoId,
            dia: dia.toLowerCase(),
            horaInicio,
            horaFin,
            toleranciaMin
        });

        await horario.save();

        res.json(horario);

    } catch (err) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const alumno = await Usuario.findById(req.user.id);

        if (!alumno || !alumno.grupoId) {
            return res.status(404).json({ error: "Alumno sin grupo" });
        }

        const horarios = await Horario.find({ grupoId: alumno.grupoId });

        res.json(horarios);

    } catch (err) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;