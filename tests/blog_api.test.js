const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);
const Blog = require("../models/blog");

test("all blogs are returned as json", async () => {
  const res = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(res.body.length).toEqual(helper.initialBlogs.length);
});

test("post adds one blog to db", async () => {
  const newBlog = {
    title: "new blog",
    author: "tomko",
    url: "www.github.com",
    likes: 0
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201);
  const blogs = await helper.blogsInDb();
  expect(blogs.length).toBe(helper.initialBlogs.length + 1);
  expect(blogs.slice(-1)[0].title).toEqual(newBlog.title);
});

test("blogs have field id", async () => {
  const res = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(res.body[0].id).toBeDefined();
});

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

afterAll(() => {
  mongoose.connection.close();
});
