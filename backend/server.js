const express = require('express')
const cors = require('cors')
const { Pool } =require('pg')

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool ({
    user: 'postgres',
    password: 'Im_Jem23*',
    host: 'localhost',
    database: 'newtestdb',
    port: 5432
})

// get task from postgres
app.get('/getTasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasktodo ORDER BY id ASC');
        res.json(result.rows)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// create task, insert it to postgres
app.post('/createTasks', async (req, res) => {
    try {
        const { task, completed } = req.body;
        const result = await pool.query('INSERT INTO tasktodo (task, completed) VALUES ($1, $2) RETURNING *', [task, completed])
        res.json(result.rows[0])
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// update task from potsgres
app.put('/updateTasks/:id', async (req, res) => {
    const {id} = req.params;
    const {task, completed} = req.body;
    try {
        const result = await pool.query('UPDATE tasktodo SET task = $1, completed = $2 WHERE id = $3 RETURNING *', [task, completed, id])
        res.json(result.rows.length === 0)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

// delete task from postgres
app.delete('/deleteTasks/:id', async (req, res) => {
    const {id} = req.params
    try {
        const result = await pool.query('DELETE FROM tasktodo WHERE id = $1 RETURNING *',
            [id])
            if(result.rows.length === 0){
                return res.status(404).json({message: 'No task found'})
            }
            res.json({message: 'Task deleted', task: result.rows[0]})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`Jem! Your server is running on Port${PORT}`)
})