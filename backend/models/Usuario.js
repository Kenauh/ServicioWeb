const mongoose = require("mongoose");

module.exports = mongoose.model("Usuario", new mongoose.Schema({
    nombre: String,
    correo: String,
    password: String,
    rol: String,
    grupoId: mongoose.Schema.Types.ObjectId
}));