const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const nameInput = process.argv[3]
const numberInput = process.argv[4]

const url =
  `mongodb+srv://willcipher:${password}@fullstackopen.trghile.mongodb.net/noteApp?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: nameInput,
  number: numberInput
})

if (!nameInput && !numberInput) {
  // If the password is the only parameter given to the program
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else {
  person.save().then(() => {
    console.log(`added ${nameInput} number ${numberInput} to phonebook`)
    mongoose.connection.close()
  })
}