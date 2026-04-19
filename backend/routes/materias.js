const router = require("express").Router();
const Horario = require("../models/Horario");
const Usuario = require("../models/Usuario");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
    try {
        const alumnoId = req.user.id;

        const alumno = await Usuario.findById(alumnoId);
        if (!alumno) {
            return res.status(404).json({ error: "Alumno no encontrado" });
        }

        if (!alumno.grupoId) {
            return res.status(404).json({ error: "Alumno sin grupo" });
        }

        const horarios = await Horario.find({ grupoId: alumno.grupoId });

        if (!horarios || horarios.length === 0) {
            return res.json([]);
        }

        const horariosFormateados = horarios.map(h => ({
            dia: h.dia,
            horaInicial: h.horaInicio,
            horaFinal: h.horaFin
        }));

        res.json([
            {
                materia: "Base de datos",
                horarios: horariosFormateados
            }
        ]);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;