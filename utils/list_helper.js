const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reduceFunc = (sum, item) => {
    return sum + item
  }
  return blogs.map(blog => blog.likes).reduce(reduceFunc, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((pre, cur) => cur.likes > pre.likes ? cur : pre)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

