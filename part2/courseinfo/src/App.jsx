/* Ex2.1 to Ex2.5*/

const Course = props => {
  return(
    <>
      <Header courses = {props.courses}/>
      <Content parts = {props.courses.parts}/>
      <Total parts = {props.courses.parts}/>
      {/*Component A = {props.A} */}
    </>
  )
}

const Header = props => {
  // console.log("Header", props)
  // props: {course} ~ courses
  return (
    <h2>{props.courses.name}</h2>
  )
}

const Part = props => {
  // console.log('Part:', props)
  // props: {name, exercises} ~ part
  return (
    <p>{props.name} {props.exercises}</p>
  )
}

const Content = props => {
  // console.log('Content', props) ~ course (has many parts)
  // props: {parts}
  const nameAndExercises = props.parts.map(part => 
    <Part key={part.id} name={part.name} exercises={part.exercises} />
  )

  return(
    <>
      {nameAndExercises}
    </>
  )
}

const Total = (props) => {
  const exerciseAmount = props.parts.map(part => part.exercises)
  // console.log('exerciseAmount:', exerciseAmount)
  const total = exerciseAmount.reduce((sum, ex) => sum + ex, 0)
  // console.log('total:', total)
  return(
    <p>
      <strong> 
        total of {total} exercises
      </strong>
    </p>
  )
}

const App = () => {
  const title = 'Web development curriculum'
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>{title}</h1>
      {courses.map(course =>
        <Course key={course.id} courses={course} />
      )}
    </div>
  )
}

export default App
