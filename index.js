require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

mongoose.connect("mongodb://localhost/vinted-api-v2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

cloudinary.config({
  cloud_name: "rafsch",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.json("Bienvenue sur l'API de Vinted");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "error 404: Wrong way!" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started! 🚀");
});
