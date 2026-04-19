const router = require("express").Router();
const Clase = require("../models/Clase");
const auth = require("../middleware/authMiddleware");

function generarQR() {
    return Math.random().toString(36).substring(2, 10);
}

// iniciar clase
router.post("/iniciar", auth, async (req, res) => {
    try {
        const { grupoId } = req.body;

        const clase = new Clase({
            grupoId,
            fecha: new Date(),
            horaInicio: new Date().toTimeString().substring(0,5),
            codigoQR: generarQR(),
            activa: true
        });

        await clase.save();

        res.json(clase);

    } catch (err) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

// cerrar clase
router.put("/cerrar/:id", auth, async (req, res) => {
    try {
        await Clase.findByIdAndUpdate(req.params.id, { activa: false });
        res.json({ mensaje: "Clase cerrada" });
    } catch {
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;