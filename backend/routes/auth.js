const router = require("express").Router();
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.post("/login", async (req, res) => {
    const { correo, password } = req.body;

    const user = await Usuario.findOne({ correo, password });

    if (!user) return res.status(401).send("Credenciales incorrectas");

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET);

    res.json({ token, rol: user.rol, userId: user._id });
});

module.exports = router;