const router = require("express").Router();
const Horario = require("../models/Horario");

router.post("/", async (req, res) => {
    const horario = new Horario(req.body);
    await horario.save();
    res.send(horario);
});

router.get("/grupo/:id", async (req, res) => {
    res.send(await Horario.find({ grupoId: req.params.id }));
});

module.exports = router;