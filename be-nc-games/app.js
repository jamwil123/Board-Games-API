const express = require("express");
const app = express();
const { apiRouter } = require("./routers/api-router");

app.use(express.json());

app.use("/api", apiRouter);

//handle PSQL errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    if (err.code == "22P02") {
      res.status(400).send({ msg: "Invalid datatype" });
    }
  }
  next(err);
});

//handle 404 errors
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

// handle 500 errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
