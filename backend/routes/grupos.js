const router = require("express").Router();
const Grupo = require("../models/Grupo");

router.post("/", async (req, res) => {
    try {
        const { nombre, profesorId } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "Falta nombre del grupo" });
        }

        const grupo = new Grupo({
            nombre,
            profesorId
        });

        await grupo.save();

        res.json(grupo);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.get("/", async (req, res) => {
    try {
        const grupos = await Grupo.find();
        res.json(grupos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;