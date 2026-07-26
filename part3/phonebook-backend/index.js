/*Ex3.1 - 3.*/

const express = require("express")
const morgan = require("morgan")
require('dotenv').config()
const Person = require('./models/person')

const app = express()

let persons = []

// App.use() Middleware
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => {
    // console.log('Request body', req.body)
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :body'))


app.get('/', (request, response) => {
    response.send('<h1>Welcome</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // console.log('POST received')
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing',
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    // console.log(person)

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person) => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date()}</div>
    `)
})

// Use assigned PORT or default PORT
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})