const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const blogModel = require('../models/db')
const logger = require('../utils/logger')
const blogHelper = require('./blog_helper')

const app = require('../app')
const api = supertest(app)



describe('test blog', () => {
  beforeEach(async () => {
    await blogModel.deleteMany({})
    logger.info('cleared')

    const blogObjects = blogHelper.initialBlogs
      .map(blog => new blogModel(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


  test('get all blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})