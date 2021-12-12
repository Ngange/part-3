const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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
  response.json(persons)
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

const nameExist = (name) => {
  return (
    persons.some(person => person.name.toLowerCase() === name.toLowerCase() )
  )
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = Math.floor(Math.random()* 500)
  const contact = {"id": id, ...body}
  console.log(!contact.name);

  if (!contact.name || !contact.number) {
    return response.status(400).json({
      error: 'name or number cannot be empty!'
    })
  } else if (nameExist(contact.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } else {
    persons = persons.concat(contact)

    response.json(contact)
  }
  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`);