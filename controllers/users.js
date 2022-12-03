const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 });
  res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).populate('notes', { content: 1, date: 1 });
  res.json(user);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = usersRouter;
