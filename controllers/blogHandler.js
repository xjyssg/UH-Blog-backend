const blogRouter = require('express').Router()
const blogModel = require('../models/blogDB')
const userModel = require('../models/userDB')
require('express-async-errors')
const jwt = require('jsonwebtoken')




blogRouter.get('/', async (request, response) => {
  const blogs = await blogModel.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.get('/:id', (request, response, next) => {
  blogModel.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await userModel.findById(decodedToken.id)

  const blog = new blogModel({
    ...request.body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await blogModel.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ error: 'access denied' })
  } else {
    await blogModel.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }

})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.title,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await blogModel.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  response.json(updatedBlog)
})


module.exports = blogRouter