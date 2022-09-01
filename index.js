
const connectToDB= require('./db')
const express = require('express')
const AuthRoutes = require('./routes/auth')
const NotesRoute = require('./routes/notes')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// routes 

app.use('/api/auth', AuthRoutes)
app.use('/api/notes',NotesRoute )


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectToDB()