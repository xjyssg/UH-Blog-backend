const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const blogModel = require('../models/blogDB')
const userModel = require('../models/userDB')
const logger = require('../utils/logger')
const blogHelper = require('./blog_helper')
const userHelper = require('./user_helper')

const app = require('../app')
const api = supertest(app)


beforeEach(async () => {
  await blogModel.deleteMany({})
  logger.info('blogs cleared')

  const blogObjects = blogHelper.initialBlogs
    .map(blog => new blogModel(blog))
  const blogPromiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(blogPromiseArray)

  await userModel.deleteMany({})
  logger.info('users cleared')

  const userObjects = userHelper.initialUsers
    .map(user => new userModel(user))
  const userPromiseArray = userObjects.map(user => user.save())
  await Promise.all(userPromiseArray)
})

describe('get blogs', () => {
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
})

describe('create blog', () => {
  test('create with auth', async () => {
    const newBlog = {
      title: 'nice', author: 'xue', url: 'www.google.com', likes: 3
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userHelper.rootToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newBlogs = await blogHelper.blogsInDb()
    expect(newBlogs.length).toBe(blogHelper.initialBlogs.length + 1)
    const newContents = newBlogs.map(blog => blog.title)
    expect(newContents).toContain('nice')
  })

  test('create without auth', async () => {
    const newBlog = {
      title: 'nice', author: 'xue', url: 'www.google.com', likes: 3
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('has likes property', async () => {
    const newBlog = {
      title: 'nice', author: 'xue', url: 'www.google.com', likes: 3
    }
    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userHelper.rootToken}`)
      .send(newBlog)
    expect(savedBlog.body.likes).toBeGreaterThan(0)
  })

  test('has title and url', async () => {
    const newBlog1 = {
      author: 'xue', url: 'www.google.com', likes: 3
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userHelper.rootToken}`)
      .send(newBlog1)
      .expect(400)

    const newBlog2 = {
      title: 'nice', author: 'xue', likes: 3
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userHelper.rootToken}`)
      .send(newBlog2)
      .expect(400)
  })
})


afterAll(() => {
  mongoose.connection.close()
  mongoose.disconnect()
  logger.info('connection closed')
})