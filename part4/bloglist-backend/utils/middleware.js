// Request logger
const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

const requestLogger = morgan(':method :url :status :body')

// Unknown endpoint detecter
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { 
    requestLogger, 
    unknownEndpoint 
}