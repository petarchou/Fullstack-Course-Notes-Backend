const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with error 400 and proper message for users with non-unique username', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = await User.findOne()

    const newUser = {
      username: user.username,
      name: 'Raikonnen',
      password: "102021"
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      expect(response.body.error).toEqual("expected 'username' to be unique")

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtStart).toEqual(usersAtEnd)
  })
})