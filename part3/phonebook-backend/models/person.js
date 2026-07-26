const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch(error => {
        console.log('error connecting to mongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
/*
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
    person.save().then(result => {
        console.log(`added ${nameInput} number ${numberInput} to phonebook`)
        mongoose.connection.close()
    })
}
*/

