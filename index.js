require('dotenv').config;
const express = require('express');
const cors = require('cors');
const app = express();

const Note = require('./models/note');
const Contact = require('./models/contact');

app.use(cors());
app.use(express.json());
app.use(express.static('build'));


app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contact) => {
    res.json(contact);
  });
});

app.get('/info', (req, res) => {
    Contact.find({}).then((contact) => {
      console.log(contact)
      res.send(
        `<h3>Phonebook has info for ${contact.length} people.</h3>
       <p>${new Date()}</p>`
      );
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res) => {
  Contact.findByIdAndRemove(req.params.id).then((contact) => {
    console.log(`${contact.name} deleted.`);
    res.status(204).end();
    // Contact.find({}).then((contact) => {
    //   res.json(contact);
    // });
  });
});

// const getRandomId = () => {
//   return Math.floor(Math.random() * 10000);
// };

// const getRandomLetter = () => {
//   const randomNum = Math.floor(Math.random() * 10);
//   return 'bonsjoidphuas'[randomNum];
// };

// const getRandomPhone = () => {
//   let phoneNumber = '';
//   for (i = 0; i < 10; i++) {
//     phoneNumber += Math.floor(Math.random() * 10).toString();
//     if (i === 2 || i === 5) {
//       [(phoneNumber += '-')];
//     }
//   }
//   return phoneNumber;
// };

app.post('/api/persons', (req, res) => {
  const body = req.body;

  const contact = new Contact({
    name: body.name,
    phone: body.phone,
    date: new Date(),
    important: true,
  });

  contact
    .save()
    .then((savedContact) => {
      console.log(savedContact);
      console.log(`added ${contact.name} to phonebook.`);
      res.json(savedContact);
    })
    .catch((err) => console.log(err));

  // if (persons.find((p) => p.name === person.name)) {
  //   return res.status(400).json('Person already exists in phonebook.').end();
  // } else if (persons.find((p) => p.number === person.number)) {
  //   return res.status(400).json('Number already exists in phonebook.').end();
  // } else if (!person.number) {
  //   return res.status(400).json('Person number missing.');
  // } else if (!person.name) {
  //   return res.status(400).json('Person name missing.');
  // } else {
  //   persons = persons.concat(person);
  //   res.json(person);
  // }
});

app.get('/hello', (req, res) => {
  res.send('<h1>Hello, Cult!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/notes', (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body;
  console.log(body)

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      console.log(updatedNote)
      res.json(updatedNote)
    })
    .catch(error => next(error))
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  
  const contact = {
    name: body.name,
    phone: body.phone
  }
  if (body.phone !== Number) {
    throw new Error('Number must consist only of numerals.')
  }
  Contact.findByIdAndUpdate(req.params.id, contact, { new: true})
    .then(updatedContact => {
      console.log(updatedContact)
      res.json(updatedContact)
    })
    .catch(error => next(error))
});

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
