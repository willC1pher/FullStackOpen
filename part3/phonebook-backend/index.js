/*Ex3.1 - 3.8*/

const express = require("express")
const morgan = require("morgan")
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

const generateId = () => {
    const max = 99
    const randomInt = Math.floor(Math.random() * max)
    return String(randomInt)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // console.log('POST received')

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing',
        })
    }

    const personNames = persons.map(person => person.name.toLowerCase())
    // console.log(personNames)
    if (personNames.includes(body.name.trim().toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    // console.log(person)

    persons = persons.concat(person)

    response.json(person)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})