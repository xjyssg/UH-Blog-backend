const userModel = require('../models/userDB')


const initialUsers = [
  { _id: "5a422a851b54a676234d17f7", username: "React", name: "Michael Chan", passwordHash: "https://reactpatterns.com/", __v: 0
  },
  { _id: "5a422aa71b54a676234d17f8", username: "Go To Statement Considered Harmful", name: "Edsger W. Dijkstra", passwordHash: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", __v: 0
  },
  { _id: "5f6c4fb87f869f57e0310263", username: "root", name: "root", passwordHash: "root", __v: 0
  },
]

const rootToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmNmM0ZmI4N2Y4NjlmNTdlMDMxMDI2MyIsImlhdCI6MTYwMDkzMzgzOH0.vCQ83LWNVurl6P7435FfCNB8m2WhpFU8GlLcLPyHq_g'

const nonExistingId = async () => {
  const user = new userModel({ username: 'something good', name: 'xue', passwordHash: 'www.google.com' })
  await user.save()
  await user.remove()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await userModel.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialUsers, nonExistingId, usersInDb, rootToken
}