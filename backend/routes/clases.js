const router = require("express").Router();
const Clase = require("../models/Clase");

function generarQR() {
    return Math.random().toString(36).substring(2, 10);
}

router.post("/iniciar", async (req, res) => {
    const { grupoId } = req.body;

    const clase = new Clase({
        grupoId,
        fecha: new Date(),
        horaInicio: new Date().toTimeString().substring(0,5),
        codigoQR: generarQR(),
        activa: true
    });

    await clase.save();
    res.send(clase);
});

router.put("/cerrar/:id", async (req, res) => {
    await Clase.findByIdAndUpdate(req.params.id, { activa: false });
    res.send("Clase cerrada");
});

module.exports = router;