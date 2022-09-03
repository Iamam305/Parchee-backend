
const mongoose  = require('mongoose')
require("dotenv").config();
const express = require('express')
const AuthRoutes = require('./routes/auth')
const NotesRoute = require('./routes/notes')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);  
  next();
});
// routes 

app.use('/api/auth', AuthRoutes)
app.use('/api/notes',NotesRoute )


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    // listen for requests
  console.log('db connected');
  })
  .catch((err) => {
    console.log(err);
  });