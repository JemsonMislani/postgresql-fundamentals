import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [task, setTask] = useState([])
  const [todo, setTodo] = useState('')

useEffect(() => {
  axios.get('http://localhost:3007/getTasks')
  .then(result => setTask(result.data))
  .catch(err => console.log(err))
}, [])

const handleAddTask = () => {
  axios.post('http://localhost:3007/createTasks', {
    task: todo, completed: false
  })
  .then(result => {
    setTask(prev => [...prev, result.data])
    setTodo('')
  })
  .catch(err => console.log(err))
}

  return (
    <>
    <div className="header">
      <h1 className='header-name'>TODO USING POSTGRES</h1>
      <div className='inp-btn'>
        <input 
            className='inp'
            type="text" placeholder='Input task'
            value={todo}
            onChange={(e) => setTodo(e.target.value)}/>
        <button
          onClick={handleAddTask}
          className='add-btn'>Add task</button>
      </div>
      <div>
        {
          task.map((td, ind) => {
            return <div 
              className='todos'
              key={ind}>
              <label>
                {td.task}
              </label>
              <button>Edit</button>
              <button>Completed</button>
              <button>Remove</button>
            </div>
          })
        }
      </div>
    </div>
    </>
  )
}


