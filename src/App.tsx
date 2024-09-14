import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskBar from './TaskBar/TaskBar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TaskBar />
      <h1>Meal Plan</h1>
      {/* https://www.w3schools.com/ */}
    </>
  )
}

export default App
