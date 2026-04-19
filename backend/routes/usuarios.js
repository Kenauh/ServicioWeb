const router = require("express").Router();
const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
    try {
        let { nombre, correo, password, rol, grupoId } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        nombre = String(nombre).trim();
        password = String(password).trim();

        const user = new Usuario({
            nombre,
            correo,
            password,
            rol,
            grupoId
        });

        await user.save();

        res.json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;