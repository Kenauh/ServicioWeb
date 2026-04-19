const router = require("express").Router();
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/login", async (req, res) => {
    try {
        let { usuario, contrsenia } = req.body;

        if (!usuario || !contrsenia) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        usuario = String(usuario).trim();
        contrsenia = String(contrsenia).trim();

        const user = await Usuario.findOne({ nombre: usuario });

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (String(user.password).trim() !== contrsenia) {
            return res.status(401).json({ error: "Password incorrecto" });
        }

        const token = jwt.sign(
            { id: user._id }, 
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
        console.error(err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;