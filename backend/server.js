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

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`Jem! Your server is running on Port${PORT}`)
})