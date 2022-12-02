const express = require('express');
const cors = require('cors');
require('express-async-errors');
const app = express();

const config = require('./utils/config');
const { info } = require('./utils/logger');
const notesRouter = require('./controllers/notes');
const contactsRouter = require('./controllers/contacts');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');



info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((error) => {
    info('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);


app.use('/api/notes', notesRouter);
app.use('/api/persons', contactsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
