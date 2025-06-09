const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use((err, req, res, next) => {
  console.log(req.url);
  console.log(`-----ERROR-----`);
  next(); // if we didnt call the next then the app will stuck in the loading window.
});

app.get("/", (req, res) => {
  console.log(req.url);
  res.send(`Welcome to the index route!`);
});

app.get("/random", (req, res) => {
  console.log(req.url);
  res.send(`Welcome to random`);
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT: ${PORT}`);
});
