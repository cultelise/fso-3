const notesRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const Note = require('../models/note');
const User = require('../models/user');

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  } return null;
};

notesRouter.get('/hello', (req, res) => {
  res.send('<h1>Hello, Cult!</h1>');
});

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
  res.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

notesRouter.post('/', async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, config.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

notesRouter.put('/:id', async (req, res) => {
  const body = req.body;
  console.log('req body...', req.body);

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  res.json(updatedNote);
});

notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = notesRouter;
