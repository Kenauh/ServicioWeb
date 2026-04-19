const router = require("express").Router();
const Asistencia = require("../models/Asistencia");
const Usuario = require("../models/Usuario");
const Horario = require("../models/Horario");
const auth = require("../middleware/authMiddleware");
const Clase = require("../models/Clase");

function formatearFecha(fecha) {
    return fecha.toString(); // "Thu Apr 16 2026 19:46:34 GMT-0600 ..."
}

function nombreDia(fecha) {
    return fecha.toLocaleDateString("es-MX", { weekday: "long" }).toLowerCase();
}

router.post("/registrar", auth, async (req, res) => {
    try {
        const { qr, fechaHora } = req.body;
        const alumnoId = req.user.id;

        const clase = await Clase.findOne({ codigoQR: qr, activa: true });
        if (!clase) {
            return res.status(400).json({ error: "QR inválido o clase cerrada" });
        }

        const alumno = await Usuario.findById(alumnoId);
        if (!alumno || !alumno.grupoId) {
            return res.status(404).json({ error: "Alumno sin grupo" });
        }

        // validar que pertenezca al grupo
        if (String(alumno.grupoId) !== String(clase.grupoId)) {
            return res.status(403).json({ error: "No pertenece a este grupo" });
        }

        const horarios = await Horario.find({ grupoId: alumno.grupoId });

        const fecha = new Date(fechaHora);
        const hoy = fecha.toLocaleDateString("es-MX", { weekday: "long" }).toLowerCase();

        const horario = horarios.find(h => h.dia.toLowerCase() === hoy);

        if (!horario) {
            return res.status(400).json({ error: "No hay clase hoy" });
        }

        const minutos = fecha.getHours() * 60 + fecha.getMinutes();
        const [h, m] = horario.horaInicio.split(":");
        const inicio = parseInt(h) * 60 + parseInt(m);

        let estado = "falta";

        if (minutos <= inicio + horario.toleranciaMin) {
            estado = "asistencia";
        } else if (minutos <= inicio + horario.toleranciaMin * 2) {
            estado = "retardo";
        }

        const inicioDia = new Date(fechaHora);
        inicioDia.setHours(0,0,0,0);

        const finDia = new Date(fechaHora);
        finDia.setHours(23,59,59,999);

        const ya = await Asistencia.findOne({
            alumnoId,
            claseId: clase._id.toString(),
            horaRegistro: { $gte: inicioDia, $lte: finDia }
        });

        if (ya) {
            return res.status(400).json({ error: "Ya registraste asistencia" });
        }

        const asistencia = new Asistencia({
            alumnoId,
            claseId: clase._id.toString(),
            estado,
            horaRegistro: fecha
        });

        await asistencia.save();

        res.json({
            fecha: fecha.toString(),
            estado
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.get("/historial", auth, async (req, res) => {
    try {
        const alumnoId = req.user.id;

        const asistencias = await Asistencia.find({ alumnoId }).sort({ horaRegistro: -1 });

        const resultado = asistencias.map(a => ({
            fecha: formatearFecha(a.horaRegistro),
            estado: a.estado,
            materia: "Base de datos"
        }));

        res.json(resultado);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;