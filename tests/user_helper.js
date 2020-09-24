const userModel = require('../models/userDB')


const initialUsers = [
  { _id: "5a422a851b54a676234d17f7", username: "React", name: "Michael Chan", passwordHash: "https://reactpatterns.com/", __v: 0
  },
  { _id: "5a422aa71b54a676234d17f8", username: "Go To Statement Considered Harmful", name: "Edsger W. Dijkstra", passwordHash: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", __v: 0
  },
  { _id: "5a422b3a1b54a676234d17f9", username: "Canonical string reduction", name: "Edsger W. Dijkstra", passwordHash: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", __v: 0
  },
]

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
  initialUsers, nonExistingId, usersInDb
}