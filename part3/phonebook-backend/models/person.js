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
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        validate: {
            validator: function(num) {
                // ^: Start of string
                // $: End of string
                // \d: One digit, \d{x, y}: x digits to y digits
                // +: One digit or more
                // .test(): Evaluate if a value matches the regex or not (Return True/False)
                return /^\d{2,3}-\d+$/.test(num)
            },
            message: 'Phone number must be in the format XX-XXXXXXXX or XXX-XXXXXXX'
        },
        minLength: 8,
    },
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

