const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is initially one user at db", async () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
      username: "root",
      password: "toor"
    });
    await user.save();
  });

  test("get returns that user", async () => {
    const users = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(users.body[0].username).toBe("root");
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "tomko",
      name: "Tommi",
      password: "asdasd"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
