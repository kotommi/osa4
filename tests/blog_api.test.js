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

describe("when deleting a blog", async () => {
  test("if it exists its deleted", async () => {
    let blogs = await helper.blogsInDb();
    const toBeDeletedBlog = blogs[0];
    await api.delete("/api/blogs/" + toBeDeletedBlog.id).expect(204);
    blogs = await helper.blogsInDb();
    expect(blogs.length).toEqual(helper.initialBlogs.length - 1);
    expect(blogs.map(blog => blog.id)).not.toContain(toBeDeletedBlog.id);
  });
  test("if it doesn't exist get 404 and nothing is deleted", async () => {
    const id = await helper.nonExistingId();
    await api.delete("/api/blogs" + id).expect(404);
    let blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length);
  });
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

test("post handles missing likes field", async () => {
  const newBlog = {
    title: "new blog",
    author: "tomko",
    url: "www.github.com"
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201);
  const savedBlogs = await helper.blogsInDb();
  expect(savedBlogs.slice(-1)[0].likes).toBe(0);
});

test("post responds with 400 if title or url is missing", async () => {
  const titleBlog = {
    title: "asd"
  };
  await api
    .post("/api/blogs")
    .send(titleBlog)
    .expect(400);
  const emptyBlog = {};
  await api
    .post("/api/blogs")
    .send(emptyBlog)
    .expect(400);
  const urlBlog = {
    url: "www.google.com"
  };
  await api
    .post("/api/blogs")
    .send(urlBlog)
    .expect(400);
  const savedBlogs = await helper.blogsInDb();
  expect(savedBlogs.length).toBe(helper.initialBlogs.length);
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
