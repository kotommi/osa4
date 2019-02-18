const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1
  });
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end();
  }

  let user = await User.findById(body.userId);
  if (!user) {
    users = await User.find({});
    user = users[0];
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id === undefined ? "erroria pukkaa" : user._id
  });

  try {
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    response.status(201).json(savedBlog.toJSON);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  const status = deletedBlog ? 204 : 404;
  response.status(status).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    likes: body.likes
  };
  try {
    const changedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true
    });
    return response.json(changedBlog.toJSON());
  } catch (e) {
    return response.status(404).end();
  }
});

module.exports = blogsRouter;
