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

const handleCompletedBtn = (id) => {
  const taskToUpdate = task.find(ttu => ttu.id === id)
  axios.put('http://localhost:3007/updateTasks/' + id, {
    task: taskToUpdate.task, completed: !taskToUpdate.completed
  })
  .then(result => {
    setTask(prev => prev.map(td => td.id === id ? 
      result.data : td
    ))
  })
  .catch(err => console.log(err))
}

const handleDeleteBtn = (id) => {
  axios.delete('http://localhost:3007/deleteTasks/' + id)
  .then(result => {
    setTask(task.filter(td => td.id !== id))
    console.log(result)
  })
  .catch(err => console.log(err))
}

  return (
    <>
    <div className="header">
      <h1 className='text-3xl font-bold text-center text-gray-800'>'TODO USING POSTGRES'</h1>
      <div className='inp-btn m-5'>
        <input 
            className='inp'
            type="text" placeholder='Input task'
            value={todo}
            onChange={(e) => setTodo(e.target.value)}/>
        <button
          onClick={handleAddTask}
          className='add-btn cursor-pointer'>Add task</button>
      </div>
      <div>
        {
          task.map((td, ind) => {
            return <div 
              className='todos bg-blue-200'
              key={ind}>
                {
                  findId === td.id ? 
                  (<>
                    <input 
                      className='border border-gray-500 rounded pl-2'
                      type="text" 
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}/>
                      <button
                        className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'
                        onClick={() => handleEditedTask(td.id)}>save</button>
                      <button
                        className='bg-red-700 text-white px-4 py-2 rounded cursor-pointer'
                        onClick={() => setFindId(null)}>close</button>
                  </>)
                  :
                  (<>
                    <label 
                      style={{
                        textDecoration: td.completed ? 'line-through' : 'none',
                        color: td.completed ? 'green' : 'black'
                      }}
                      className='flex justify-center items-center'
                    >
                      {td.task}
                    </label>
                    <button 
                      onClick={() => handleEditBtn(td)}
                      className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'>Edit</button>
                    <button 
                      onClick={() => handleCompletedBtn(td.id)}
                      className='bg-green-700 text-white px-2 py-2 rounded cursor-pointer'>{td.completed ? 'Undo task' : 'Completed'}</button>
                    <button
                      onClick={() => handleDeleteBtn(td.id)}
                      className='bg-red-700 text-white px-2 py-2 rounded cursor-pointer'>Remove</button> 
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


