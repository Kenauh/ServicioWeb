const mongoose = require("mongoose");

module.exports = mongoose.model("Clase", new mongoose.Schema({
    grupoId: mongoose.Schema.Types.ObjectId,
    fecha: Date,
    horaInicio: String,
    horaCierre: String,
    codigoQR: String,
    activa: Boolean
}));