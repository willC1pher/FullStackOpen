/* Ex1.6 to Ex1.11*/
import { useState } from 'react'

const Header = (props) => {
  // console.log('Header: ', props)
  return(
    <h1>
      {props.header}
    </h1>
  )
}

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <div>
        <Header header={props.header}/>
        No feedback given
      </div>
    )
  }
  return (
      <>
        <Header header={props.header}/>
        <table>
          <tbody>
            <tr>
              <StatisticLine text1="good" value={props.good}/>
            </tr>
            <tr>
              <StatisticLine text1="neutral" value={props.neutral}/>
            </tr>
            <tr>
              <StatisticLine text1="bad" value={props.bad}/>
            </tr>
            <tr>
              <StatisticLine text1="all" value={props.total}/>
            </tr>
            <tr>
              <StatisticLine text1="average" value={props.average}/>
            </tr>
            <tr>
              <StatisticLine text1="positive" value={props.positive} text2="%"/>
            </tr>
          </tbody>
        </table>  
      </>
  )
}

const Button = (props) => {
  // console.log('Button: ', props)
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = (props) => {
  // console.log('Result: ', props)
  return(
    <>
      <td>{props.text1}</td>
      <td >{props.value} {props.text2}</td>
    </>
  )
}

const App = () => {
  const header = [
    'give feedback',
    'statistics'
  ]

  const goodValue = 1
  const badValue = -1
  const neutralValue = 0
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    console.log('Prev good: ', good)
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log(updatedGood)
  }
  
  const handleBadClick = () => {
    console.log('Prev bad: ', bad)
    const updatedBad = bad + 1
    setBad(updatedBad)
    console.log(updatedBad)
  }
  
  const handleNeutralClick = () => {
    console.log('Prev neutral: ', neutral)
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    console.log(updatedNeutral)
  }

  const calculateTotal = () => {
    return (good + bad + neutral)
  }

  const calculateAverage = () => {
    const total = good + bad + neutral
    if (total === 0) {
      return 0
    }
    return (good * goodValue + bad * badValue + neutral * neutralValue) / total
  }

  const calculatePositive = () => {
    const total = good + bad + neutral
    if (total === 0) {
      return 0
    }
    return (good / total) * 100
  }

  return (
    <div>
        {/* give feedback */}
        <Header header = {header[0]}/>
        <Button onClick={handleGoodClick} text='good'/>
        <Button onClick={handleNeutralClick} text='neutral'/>
        <Button onClick={handleBadClick} text='bad'/>

        {/* statistics */}
        <Statistics 
          header={header[1]}
          good={good}
          neutral={neutral}
          bad={bad}
          total={calculateTotal()}
          average={calculateAverage()}
          positive={calculatePositive()}
        />
    </div>
  )
}

export default App
