require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGO_URI } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/auth", require("./routes/auth"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/grupos", require("./routes/grupos"));
app.use("/horarios", require("./routes/horarios"));
app.use("/asistencia", require("./routes/asistencia"));
app.use("/materias", require("./routes/materias"));

const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB conectado");

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    })
    .catch(err => {
        console.error("Error al conectar MongoDB:", err);
        process.exit(1); 
    });