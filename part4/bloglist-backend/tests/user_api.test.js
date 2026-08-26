const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const helper = require('./user_test_helper')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


const api = supertest(app)

describe('When there is initially one user at database', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('Ckrit', 10)
    // console.log('password hash', passwordHash)
    const initialUser = new User({ username: 'admin', passwordHash })

    await initialUser.save()
  })

  describe('addition of a new user', () => {
    test('fails with status code 400 if the username is less than 3 characters', async () => {
      const dbBefore = await helper.usersInDb()

      const newUser = {
        'username': 'V',
        'password': 'scandinavian'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const dbAfter = await helper.usersInDb()

      assert.strictEqual(dbAfter.length, dbBefore.length)
      assert(response.body.error.includes('Username must be at least 3 characters.'))
    })
    test('fails with status code 400 if the username is left blank', async () => {
      const dbBefore = await helper.usersInDb()
      
      const newUser = {
        'password': 'scandinavian'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const dbAfter = await helper.usersInDb()

      assert.strictEqual(dbAfter.length, dbBefore.length)
      assert(response.body.error.includes('Username cannot be blank.'))
    })
    test('fails with status code 400 if the username is not unique', async () => {
      const dbBefore = await helper.usersInDb()

      const newUser = {
        'username': 'admin',
        'password': 'scandinavian'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const dbAfter = await helper.usersInDb()

      assert.strictEqual(dbAfter.length, dbBefore.length)
      assert(response.body.error.includes('Username must be unique'))
    })
    test('fails with status code 400 if the password is less than 3 characters', async () => {
      const dbBefore = await helper.usersInDb()

      const newUser = {
        'username': 'Viking',
        'password': 's'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const dbAfter = await helper.usersInDb()

      assert.strictEqual(dbAfter.length, dbBefore.length)
      assert(response.body.error.includes('Password must be at least 3 characters.'))
    })
    test('fails with status code 400 if the password is left blank', async () => {
      const dbBefore = await helper.usersInDb()

      const newUser = {
        'username': 'Viking'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const dbAfter = await helper.usersInDb()

      assert.strictEqual(dbAfter.length, dbBefore.length)
      assert(response.body.error.includes('Password cannot be blank.'))
    })
  })
})

after(async () => {
  mongoose.connection.close()
})