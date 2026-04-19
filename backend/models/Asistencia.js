const mongoose = require("mongoose");

module.exports = mongoose.model("Asistencia", new mongoose.Schema({
    alumnoId: mongoose.Schema.Types.ObjectId,
    claseId: String,
    estado: String,
    horaRegistro: Date
}));