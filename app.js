const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const blogsRouter = require("./controllers/blogs");
app.use("/api/blogs", blogsRouter);

module.exports = app;
