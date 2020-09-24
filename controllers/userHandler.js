const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const userModel = require('../models/userDB')


usersRouter.get('/', async (request, response) => {
  const users = await userModel.find({})
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password should be at at least 3 characters' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(body.password, saltRounds)

    const user = new userModel({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser.toJSON())
  }
})


module.exports = usersRouter