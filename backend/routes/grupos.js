const router = require("express").Router();
const Grupo = require("../models/Grupo");

router.post("/", async (req, res) => {
    const grupo = new Grupo(req.body);
    await grupo.save();
    res.send(grupo);
});

router.get("/", async (req, res) => {
    res.send(await Grupo.find());
});

module.exports = router;