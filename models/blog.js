const mongoose = require("mongoose");
const config = require("../utils/config");

const mongoUrl = config.MONGODB_URI;

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error while trying to connect to mongodb", error.message);
  });

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

module.exports = mongoose.model("Blog", blogSchema);
