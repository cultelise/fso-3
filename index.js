const express = require('express')
const app = express()
const cors = require('cors');


app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

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

app.get('/', (request, response) => {
  response.send('<h1>Hello, Cult!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  return maxId
};

app.post('/api/notes', (req, res) => {
  const body = req.body
  
  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  res.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const port = 8080
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
