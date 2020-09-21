const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reduceFunc = (sum, item) => {
    return sum + item
  }
  return blogs.map(blog => blog.likes).reduce(reduceFunc, 0)
}

module.exports = {
  dummy,
  totalLikes
}

