const mongoose = require("mongoose");

module.exports = mongoose.model("Grupo", new mongoose.Schema({
    nombre: String,
    profesorId: mongoose.Schema.Types.ObjectId
}));