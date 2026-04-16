const mongoose = require("mongoose");

module.exports = mongoose.model("Horario", new mongoose.Schema({
    grupoId: mongoose.Schema.Types.ObjectId,
    dia: String,
    horaInicio: String,
    horaFin: String,
    toleranciaMin: Number
}));