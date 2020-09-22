const blogRouter = require('express').Router()
const blogModel = require('../models/db')
require('express-async-errors')


blogRouter.get('/', async (request, response) => {
  const blogs = await blogModel.find({})
  response.json(blogs)
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

blogRouter.post('/', (request, response, next) => {
  const blog = new blogModel(request.body)

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    })
    .catch(error => next(error))
})

blogRouter.delete('/:id', (request, response, next) => {
  blogModel.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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