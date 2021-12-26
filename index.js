require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

//token for request body
morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(morgan('tiny'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response)  => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  let contacts = persons.length
  const date = new Date()

  response.send(`Phonebook has info for ${contacts} people <br/><br/> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id, typeof id);
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', morgan(':body'), (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number cannot be empty!'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(saved => {
    response.json(saved)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})