const router = require("express").Router();
const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
    const user = new Usuario(req.body);
    await user.save();
    res.send(user);
});

router.get("/", async (req, res) => {
    res.send(await Usuario.find());
});

module.exports = router;