const mongoose = require('mongoose');

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log(
    'Please provide the password, name, and phone number as arguments: node mongo.js <password> <name> <phone>'
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];

const url = `mongodb+srv://cultelise:${password}@cluster0.rd7shve.mongodb.net/PhoneBookApp?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  date: Date,
  important: Boolean,
});

const Contact = mongoose.model('Contact', contactSchema);

if (name === undefined) {
  mongoose.connect(url).then((result) => {
    console.log('connected');

    Contact.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    });
  });
} else {
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected');
      const contact = new Contact({
        name: name,
        phone: phone,
        date: new Date(),
        important: true,
      });

      return contact.save();
    })
    .then((result) => {
      console.log(result);
      console.log(`added ${name}, number: ${phone} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
