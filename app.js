const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const blogsRouter = require("./controllers/blogs");
app.use("/api/blogs", blogsRouter);

const usersRouter = require("./controllers/users");
app.use("/api/users", usersRouter);

module.exports = app;
