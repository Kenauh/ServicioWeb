require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGO_URI } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

// rutas
app.use("/auth", require("./routes/auth"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/grupos", require("./routes/grupos"));
app.use("/horarios", require("./routes/horarios"));
app.use("/clases", require("./routes/clases"));
app.use("/asistencia", require("./routes/asistencia"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));