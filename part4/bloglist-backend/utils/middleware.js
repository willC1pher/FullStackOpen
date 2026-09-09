const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Request logger
const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

const requestLogger = morgan(':method :url :status :body')

//-----------------------
// Unknown endpoint detecter
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//-----------------------
// Error handler
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    /*
      422: Server understood client's request
      but could not process due to data having failed validation rule.
      Eg: Missing required fields or incorrect formats.
    */
    return response.status(400).json({ error: error.message })
  }
  // Mongoose validations do not detect the index violation (uniqueness index)
  else if (error.name === 'MongoServerError'
    && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'Username must be unique' })
  }
  // else if (error.name === 'JsonWebTokenError') {
  //   return response.status(401).json({
  //     error: 'Token missing or invalid.'
  //   })
  // }
  // else if (error.name = 'TokenExpiredError') {
  //   return response.status(401).json({
  //     error: 'Token expired.'
  //   })
  // }

  next(error)
  // console.log('ERROR:', error)
  // console.log('ERROR NAME:', error.name)
  // console.log('ERROR MESSAGE:', error.message)
  // console.log('ERROR CODE:', error.code)
}

//-----------------------
// Token extractor
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

//-----------------------
// User extractor
const userExtractor = async (request, response, next) => {
  // Use try-catch because if request.token does not exist, jwt.verify()
  // throws before the 'if' statement.
  try {
      const decodedToken = jwt.verify(
      request.token, 
      process.env.SECRET
    )

    if (!decodedToken.id) {
      return response.status(401).json({ 
        error: 'Token missing or invalid.' 
      })
    }

      request.user = await User.findById(decodedToken.id)
  
    next()
  }
  catch (error) {
    next(error)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}