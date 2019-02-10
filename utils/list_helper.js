const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum + Number(blog.likes);
  }, 0);
};

const favoriteBlog = blogs => {
  return blogs.length === 0
    ? {}
    : blogs.slice(0).sort((a, b) => {
        // sort in descending order
        return Number(b.likes) - Number(a.likes);
      })[0];
};

const mostBlogs = blogs => {
  const authors = blogs.map(blog => {
    return blog.author;
  });
  const dict = {};
  for (i in authors) {
    if (dict[authors[i]]) {
      dict[authors[i]]++;
    } else {
      dict[authors[i]] = 1;
    }
  }
  let returnAuthor = 0;
  let maxBlogs = 0;
  for (key in dict) {
    if (dict[key] > maxBlogs) {
      maxBlogs = dict[key];
      returnAuthor = key;
    }
  }
  return {
    author: returnAuthor,
    blogs: maxBlogs
  };
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
};
