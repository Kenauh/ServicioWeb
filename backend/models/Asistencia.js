const mongoose = require("mongoose");

module.exports = mongoose.model("Asistencia", new mongoose.Schema({
    alumnoId: mongoose.Schema.Types.ObjectId,
    claseId: mongoose.Schema.Types.ObjectId,
    estado: String,
    horaRegistro: Date
}));