const router = require("express").Router();
const Asistencia = require("../models/Asistencia");
const Clase = require("../models/Clase");
const Usuario = require("../models/Usuario");
const Horario = require("../models/Horario");

router.post("/registrar", async (req, res) => {

    const { alumnoId, qr } = req.body;

    const clase = await Clase.findOne({ codigoQR: qr, activa: true });
    if (!clase) return res.status(400).send("QR inválido");

    const ya = await Asistencia.findOne({ alumnoId, claseId: clase._id });
    if (ya) return res.status(400).send("Ya registraste");

    const alumno = await Usuario.findById(alumnoId);
    const horario = await Horario.findOne({ grupoId: alumno.grupoId });

    const ahora = new Date();
    const minutos = ahora.getHours()*60 + ahora.getMinutes();

    const [h,m] = horario.horaInicio.split(":");
    const inicio = parseInt(h)*60 + parseInt(m);

    let estado = "falta";

    if(minutos <= inicio + horario.toleranciaMin){
        estado = "asistencia";
    } else if(minutos <= inicio + horario.toleranciaMin*2){
        estado = "retardo";
    }

    const asistencia = new Asistencia({
        alumnoId,
        claseId: clase._id,
        estado,
        horaRegistro: new Date()
    });

    await asistencia.save();
    res.send(asistencia);
});

module.exports = router;