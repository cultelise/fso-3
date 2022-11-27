const e = require('express')
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(
    `<h3>Phonebook has info for ${persons.length} people.</h3>
     <p>${new Date}</p>`
  )
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (!person) {
    res.status(404).end()
  } else res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  return res.json(persons)
})

const getRandomId = () => {
  return Math.floor(Math.random() * 10000)
}

const getRandomLetter = () => {
  const randomNum = Math.floor(Math.random() * 10)
  return 'bonsjoidphuas'[randomNum]
};

const getRandomPhone = () => {
  let phoneNumber = '' 
  for (i = 0; i < 10; i++) {
    phoneNumber += Math.floor(Math.random() * 10).toString()
    if (i === 2 || i === 5) {
      [phoneNumber += '-']
    }
  } 
  return phoneNumber
};

app.post('/api/persons', (req, res) => {
  const person = {
    id: getRandomId(),
    name: getRandomLetter(),
    number: getRandomPhone()
  } 

  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json('Person already exists in phonebook.').end()
  } else if (persons.find(p => p.number === person.number)) {
    return res.status(400).json('Number already exists in phonebook.').end()
  } else if (!person.number) {
    return res.status(400).json('Person number missing.')
  } else if (!person.name) {
    return res.status(400).json('Person name missing.')
  } else {
  persons = persons.concat(person)
  res.json(persons)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`...listening on port ${PORT}`)
})