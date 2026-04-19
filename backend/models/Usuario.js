const mongoose = require("mongoose");

module.exports = mongoose.model("Usuario", new mongoose.Schema({
    nombre: String,
    correo: {
        type: String,
        lowercase: true,
        trim: true
    },
    password: String,
    rol: String,
    grupoId: mongoose.Schema.Types.ObjectId
}));