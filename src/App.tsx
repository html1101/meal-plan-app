import { useState } from 'react'
import './App.css'
import TaskBar from './TaskBar/TaskBar'
import Welcome from './Welcome/Welcome'
import Home from './Home/Home';
import Questions from './Questions/Questions';

enum AppState {
  Welcome,
  Questions,
  Results
}

export type QuestionType = {
  amount: number,
  store: string
}

function App() {
  const [ appState, setAppState ] = useState(AppState.Welcome);
  const [ saveQuestions, setQuestionAnswers ] = useState<QuestionType | null>(null);

  console.log("Got results to questions: ", saveQuestions);
  return (
    <div className="content_body">
      <TaskBar />
      <div className="content">
        {
          appState === AppState.Welcome ? <Welcome /> :
          appState === AppState.Questions ? <Questions setQuestionAnswers={setQuestionAnswers}/> :
          <Home />
        }
      </div>
      {/* https://www.w3schools.com/ */}
    </div>
  )
}



export default App
