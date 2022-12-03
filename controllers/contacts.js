const contactsRouter = require('express').Router();

const { info } = require('../utils/logger');
const Contact = require('../models/contact');

contactsRouter.get('/', async (req, res) => {
  const contact = await Contact.find({});
  res.json(contact);
});

contactsRouter.get('/info', async (req, res) => {
  const contact = await Contact.find({});
  res.send(
    `<h3>Phonebook has info for ${contact.length} people.</h3>
      <p>${new Date()}</p>`
  );
});

contactsRouter.get('/:id', async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    res.json(contact);
  } else res.status(404).end();
});

contactsRouter.post('/', async (req, res) => {
  const body = req.body;
  console.log(req.body);

  const contact = new Contact({
    name: body.name,
    phone: body.phone,
    date: new Date(),
    important: true,
  });

  const savedContact = await contact.save();
  res.status(201).json(savedContact);
});

contactsRouter.put('/:id', async (req, res) => {
  const body = req.body;
  console.log('req.body...', req.body);

  const contact = {
    name: body.name,
    phone: body.phone,
    important: true,
  };

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    contact,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  res.json(updatedContact);
});

contactsRouter.delete('/:id', async (req, res) => {
  const contact = await Contact.findByIdAndRemove(req.params.id);
  info(`${contact.name} deleted.`);
  info('---');
  res.status(204).end();
});

module.exports = contactsRouter;
