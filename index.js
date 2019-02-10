const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./utils/config");

app.use(cors());
app.use(bodyParser.json());

const blogsRouter = require("./ controllers/blogs");
app.use("/api/blogs", blogsRouter);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
