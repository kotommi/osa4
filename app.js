const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.requestLogger);

const blogsRouter = require("./controllers/blogs");
app.use("/api/blogs", blogsRouter);

const usersRouter = require("./controllers/users");
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
