const router = require("express").Router();
const Asistencia = require("../models/Asistencia");
const Usuario = require("../models/Usuario");
const Horario = require("../models/Horario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function formatearFecha(fecha) {
    return fecha.toString();
}

function limpiarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

router.post("/registrar", async (req, res) => {
    try {
        const { apikey, dipositivoId, alumnoId, materiaId, fechaHora } = req.body;

        if (!apikey || !alumnoId || !materiaId || !fechaHora) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        try {
            jwt.verify(apikey, JWT_SECRET);
        } catch {
            return res.status(401).json({ error: "Token inválido" });
        }

        const alumno = await Usuario.findById(alumnoId);
        if (!alumno || !alumno.grupoId) {
            return res.status(404).json({ error: "Alumno no encontrado" });
        }

        const horarios = await Horario.find({ grupoId: alumno.grupoId });

        const fecha = new Date(String(fechaHora));

        const hoy = limpiarTexto(
            fecha.toLocaleDateString("es-MX", { weekday: "long" })
        );

        const horario = horarios.find(
            h => limpiarTexto(h.dia) === hoy
        );

        if (!horario) {
            return res.status(400).json({ error: "No hay clase hoy" });
        }

        const minutos = fecha.getHours() * 60 + fecha.getMinutes();
        const [h, m] = horario.horaInicio.split(":");
        const inicio = parseInt(h) * 60 + parseInt(m);

        let estado = "retardo";

        if (minutos <= inicio + horario.toleranciaMin) {
            estado = "asistencia";
        } else if (minutos <= inicio + horario.toleranciaMin * 2) {
            estado = "retardo";
        }

        const inicioDia = new Date(fecha);
        inicioDia.setHours(0, 0, 0, 0);

        const finDia = new Date(fecha);
        finDia.setHours(23, 59, 59, 999);

        const ya = await Asistencia.findOne({
            alumnoId,
            materiaId,
            horaRegistro: { $gte: inicioDia, $lte: finDia }
        });

        if (ya) {
            return res.status(400).json({ error: "Ya registraste asistencia" });
        }

        const asistencia = new Asistencia({
            alumnoId,
            materiaId,
            estado,
            horaRegistro: fecha
        });

        await asistencia.save();

        res.json({
            fecha: formatearFecha(fecha),
            estado
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.post("/historial", async (req, res) => {
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

        const alumnoId = decoded.id;

        const asistencias = await Asistencia.find({ alumnoId })
            .sort({ horaRegistro: -1 });

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