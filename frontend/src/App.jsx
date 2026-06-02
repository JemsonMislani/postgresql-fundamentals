import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [task, setTask] = useState([])
  const [todo, setTodo] = useState('')
  const [findId, setFindId] = useState(null)
  const [editTask, setEditTask] = useState('')

useEffect(() => {
  axios.get('http://localhost:3007/getTasks')
  .then(result => setTask(result.data))
  .catch(err => console.log(err))
}, [])

const handleAddTask = () => {
  if(!todo) {
    alert('please fill out fields!')
    return
  }
  axios.post('http://localhost:3007/createTasks', {
    task: todo, completed: false
  })
  .then(result => {
    setTask(prev => [...prev, result.data])
    setTodo('')
  })
  .catch(err => console.log(err))
}

const handleEditBtn = (t) => {
  setFindId(t.id)
  setEditTask(t.task)
}

const handleEditedTask = (id) => {
  const taskcompleted = task.find(tc => tc.id === id)
  axios.put('http://localhost:3007/updateTasks/' + id, {
    task: editTask, completed: taskcompleted.completed
  })
  .then(result => {
    setTask(prev => prev.map(td => td.id === id
      ?
      result.data : td
    ))
    setFindId(null)
    setEditTask('')
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
                {
                  findId === td.id ? 
                  (<>
                    <input 
                      type="text" 
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}/>
                      <button
                        onClick={() => handleEditedTask(td.id)}>save</button>
                      <button
                        onClick={() => setFindId(null)}>close</button>
                  </>)
                  :
                  (<>
                    <label>
                      {td.task}
                    </label>
                    <button onClick={() => handleEditBtn(td)}>Edit</button>
                    <button>Completed</button>
                    <button>Remove</button> 
                  </>)
                }
            </div>
          })
        }
      </div>
    </div>
    </>
  )
}


