/* Ex2.6 to Ex2.17*/

import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

// The search box
const Filter = (props) => {
  return(
    <div>
      filter shown with<input value={props.searchQuery} onChange={props.handleSearchQueryChange}/>
    </div>
  )
}

// Container for name & number inputs + submit button
const PersonForm = (props) => {
  return(
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

// Container to handle map looping
const Persons = (props) => {
  return(
    <>
      {props.persons.map(person => 
        <PersonDetail 
          key={person.id} person={person}
          handleDeletion={() => props.handleDeletion(person.id)}
        />)}
    </>
  )
}

// Container to show a single person's detail
const PersonDetail = (props) => {
  return(
    <div>
      {props.person.name} {props.person.number} 
      <button onClick={props.handleDeletion}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('Welcome to Phonebook App')
  const [successState, setSuccessState] = useState(true)

  // Fetch the persons data from db
  useEffect(() => {
    // console.log('effect')
    
    phonebookService
    .getAll()
    .then((initialPhonebook) => {
      // console.log('promise fulfilled')
      setPersons(initialPhonebook)
    })
  }, [])
  // console.log('render ', persons.length, ' persons')


  // Save the person to phonebook
  const addPerson = (event) => {
    event.preventDefault()
    // console.log("Add event", event)

    // Input does not suffice
    if (newName.trim() === '' || newNumber.trim() === '') {
      alert(`Please fill in both text box`)
      return
    }

    const nameArray = persons.map(person => (person.name.toLowerCase()))
    // console.log("Names before adding", nameArray)
    const numberArray = persons.map(person => (person.number.replace(/\D/g, '')))

    /* Normalize name: 
    remove outer spaces, 
    turn multiple spaces into a single space between words,
    and lower case it.
    */
    const nameExists = nameArray.includes(newName.replace(/\s+/g, ' ').toLowerCase().trim())
    if (nameExists) {
      handleNumberReplacement(newName, newNumber)
      return
    }

    // Normalize number:
    // Retain only digits
    const numberExists =numberArray.includes(newNumber.replace(/\D/g, ''))
    if (numberExists) {
      alert(`${newNumber} is already assigned to someone`)
      setNewName('')
      setNewNumber('')
      return
    }

    // Do not save new name straight away as persons is an array of object (containing a string)
    // while newName is just a string
    const convertToObject = {
      name: newName.replace(/\s+/g, ' ').trim(),
      number: newNumber.trim(),
      id: persons.length + 1 + ''
    }

    // Update numbers to backend server
    phonebookService
      .create(convertToObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        // Reset the success state
        setSuccessState(true)
        setMessage(`Added ${newName}`)

        setTimeout(() => {
          setMessage(null)
        }, 5000)

        setNewName('')
        setNewNumber('')
      })
  }

  // Filter the persons based on search query
  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )
  // console.log(personsToShow)

  // Keep track of the change in text box
  const handleNameChange = (event) => {
    // console.log("Change in text box", event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    // console.log("Change in text box", event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchQueryChange = (event) => {
    // console.log("Change in search box", event.target.value)
    setSearchQuery(event.target.value)
  }

  // Handle deletion of numbers
  const handleDeletion = (id) => {
    const personToDelete = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      phonebookService
        .erase(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setSuccessState(false)
          setMessage(`Information of ${personToDelete.name} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
          }, 10000)
        })
    }
  }

  // Handle if an old name with a new number is added
  const handleNumberReplacement = (newName, newNumber) => {
    const personToReplace = 
      persons.find(person => 
        person.name.toLowerCase() === newName.replace(/\s+/g, ' ').toLowerCase().trim())
    
    if (personToReplace) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = {...personToReplace, number: newNumber.trim()}
        
        phonebookService
          .update(personToReplace.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id === personToReplace.id ? returnedPerson : person
            ))
          
          // Reset the success state
          setSuccessState(true)
          setMessage(`Changed ${newName}`)
          
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          })
          .catch(error => {
            setSuccessState(false)
            setMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 10000)
          })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} successState={successState}/>
      <Filter searchQuery={searchQuery} handleSearchQueryChange={handleSearchQueryChange}/>
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        persons={personsToShow}
        handleDeletion={handleDeletion}
      />
    </div>
  )
}

export default App