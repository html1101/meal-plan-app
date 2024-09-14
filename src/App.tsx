import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskBar from './TaskBar/TaskBar'
import Welcome from './Welcome/Welcome'
import Start from './Start/Start'

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <>
      <TaskBar />
      <Welcome />
      <Start />
      {/* <h1>Welcome to the Meal Plan Generator!</h1> */}
      {/* https://www.w3schools.com/ */}
    </>
  )
}



export default App
