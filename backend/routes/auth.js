const router = require("express").Router();
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/login", async (req, res) => {
    try {
        const { usuario, contrsenia } = req.body;

        if (!usuario || !contrsenia) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const user = await Usuario.findOne({correo: usuario.trim().toLowerCase()});

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (String(user.password).trim() !== String(contrsenia).trim()) {
            return res.status(401).json({ error: "Password incorrecto" });
        }

        const token = jwt.sign(
            { id: user._id, rol: user.rol },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const fechaExp = new Date();
        fechaExp.setDate(fechaExp.getDate() + 1);

        res.json({
            apikey: token,
            fechaDeEpiracion: fechaExp.toISOString().split("T")[0]
        });

    } catch (err) {
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;