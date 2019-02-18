const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  });

  try {
    const savedBlog = await blog.save();
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

module.exports = blogsRouter;
