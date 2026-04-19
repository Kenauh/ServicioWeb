require("dotenv").config();

if (!process.env.MONGO_URI) {
    throw new Error("Falta MONGO_URI en el .env");
}

if (!process.env.JWT_SECRET) {
    throw new Error("Falta JWT_SECRET en el .env");
}

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
};