require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("./passport-config");
const jwt = require("jsonwebtoken");

const indexRouter = require("./routes/indexRouter");
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  optionsSuccessStatus: 200
};

// MIDDLEWARES
// Permisos de origenes
app.use(cors(corsOptions));
// Permite recibir JSON desde fetch
app.use(express.json());
// Permite recibir formularios URL-encoded, si los necesitas
app.use(express.urlencoded({ extended: true }));
// Inicializa Passport
app.use(passport.initialize());

// ROUTERS
app.use("/", indexRouter);
app.use("/posts", postRouter);
app.use("/auth", authRouter);

// 404 - endpoint no encontrado
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint not found"
  });
});

// MIDDLEWARES: ERRORES INTERNOS
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error"
  });
});

// SERVER
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});