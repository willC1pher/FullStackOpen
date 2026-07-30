/*Ex3.1 - 3.22*/

const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

// App.use() Middleware
app.use(express.static('dist'))
app.use(express.json())

// Request logger
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :body'))


app.get('/', (request, response) => {
  response.send('<h1>Welcome</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const nameInput = body.name
  const numberInput = body.number

  // console.log('POST received')
  if (!nameInput || !numberInput) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  const person = new Person({
    name: nameInput,
    number: numberInput,
  })

  // person.save(): Save the document to the DB
  person.save()
    .then(savedPerson => {
      // response.json(savedPerson): Save the object to the FE
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`
                <div>Phonebook has info for ${count} people</div>
                <div>${new Date()}</div>
            `)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  // Save the person to DB
    .then(person => {
      person.number = request.body.number
      return person.save()
    })
  // Save the person to FE
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Moving error handling to middleware (This has to be last)
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Use assigned PORT or default PORT
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})