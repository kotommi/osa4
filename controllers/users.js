const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });
    const savedUser = await user.save();
    return response.status(200).json(savedUser);
  } catch (e) {
    console.log(e.message);
    return status(400).end();
  }
});

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({});
    return response.json(users.map(u => u.toJSON())).end();
  } catch (e) {
    response.status(400).end();
  }
});

module.exports = usersRouter;
