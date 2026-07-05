/*Ex1.12 to Ex1.14*/
import { useState } from 'react'

const Button = (props) => {
  const { onClick, text } = props
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Header = (props) => {
  return(
    <h1>{props.header}</h1>
  )
}

const DisplayAnecdoteOfTheDay = (props) => {
  return (
    <div>
      <Header header = {props.header}/>
      {props.anecdotes[props.selected]} <br />
      has {props.currentVoted} vote{props.currentVoted === 1 ? '' : 's'}
    </div>
  )
}

const DisplayAnecdoteWithMostVotes = (props) => {
  console.log("All vote: ", props.allVoted)
  const maxVoted = Math.max(...(props.allVoted))
  console.log("max vote: ", maxVoted)
  const maxVoteIndex = props.allVoted.indexOf(maxVoted)
  const maxAnecdote = props.anecdotes[maxVoteIndex]
  console.log(maxAnecdote)

  return (
    <div>
      <Header header = {props.header}/>
      {maxAnecdote} <br />
      has {maxVoted} vote{maxVoted === 1 ? '' : 's'}
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const header = [
    'Anecdote of the day',
    'Anecdote with most votes'
  ]
   
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  const [voted, setVoted] = useState(new Array(anecdotes.length).fill(0))

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    console.log(randomIndex)
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const copy = [...voted]

    copy[selected]++;
    setVoted(copy)
  }


  return (
    <div>
      <DisplayAnecdoteOfTheDay 
        header={header[0]} 
        anecdotes={anecdotes} 
        selected={selected} 
        currentVoted={voted[selected]}
      />
      <Button onClick={handleVote} text="vote"/>
      <Button onClick={handleClick} text="next anecdotes"/>
      <DisplayAnecdoteWithMostVotes 
        header={header[1]} 
        anecdotes={anecdotes} 
        allVoted={voted}
      />
    </div>
  )
}

export default App