const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('express')
const { models } = require('mongoose')

/*
get the request body
if check if user exists by finding username, if not => pwcorrect = false; if yes => pw correct = checkpw()

if (username or pw false) return status code 401 + message

create token with jwt.sign() (token contain username and user id)

response status code 200 and send {token, username, name}
*/

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter