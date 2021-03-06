const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (body.password === undefined || body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "password too short" })
      .end();
  }
  try {
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
    next(e);
  }
});

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs");
    return response.json(users.map(u => u.toJSON())).end();
  } catch (e) {
    next(e);
  }
});

module.exports = usersRouter;
