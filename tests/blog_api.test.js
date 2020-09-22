const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const blogModel = require('../models/db')
const logger = require('../utils/logger')
const blogHelper = require('./blog_helper')

const app = require('../app')
const api = supertest(app)



describe('test blog', () => {
  beforeEach(async done => {
    await blogModel.deleteMany({})
    logger.info('cleared')

    const blogObjects = blogHelper.initialBlogs
      .map(blog => new blogModel(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    done()
  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verify id property', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => expect(blog).toHaveProperty('id'))
  })

  test('add a new blog', async () => {
    const newBlog = {
      title: 'nice', author: 'xue', url: 'www.google.com', likes: 3
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogs = await blogHelper.blogsInDb()
    expect(newBlogs.length).toBe(blogHelper.initialBlogs.length + 1)
    const newContents = newBlogs.map(blog => blog.title)
    expect(newContents).toContain('nice')
  })

  afterAll(done => {
    mongoose.connection.close()
    done()
  })
})