const blogRouter = require('express').Router()
const blogModel = require('../models/db')
require('express-async-errors')


blogRouter.get('/', async (request, response) => {
  const blogs = await blogModel.find({})
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
  const blog = new blogModel(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
  await blogModel.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

blogRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    name: body.name,
    number: body.number
  }

  blogModel.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogRouter