const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const userModel = require('../models/userDB')
const logger = require('../utils/logger')
const userHelper = require('./user_helper')

const app = require('../app')
const api = supertest(app)


beforeEach(async done => {
  await userModel.deleteMany({})
  logger.info('cleared')

  const userObjects = userHelper.initialUsers
    .map(user => new userModel(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
  done()
})

describe('get users', () => {
  test('all users', async () => {
    await api
      .get('/api/users')
      .expect(200)
  })
})


describe('create a new user', () => {

  test('valid username & password', async () => {
    const newUser = {
      username: 'jack', name: 'jack', password: 'jack'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('invalid username', async () => {
    const newUser = {
      username: "ja", name: "jack", password: "jack"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('invalid password', async () => {
    const newUser = {
      username: "jack", name: "jack", password: "ja"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})


afterAll(() => {
  mongoose.connection.close()
  mongoose.disconnect()
  logger.info('connection closed')
})