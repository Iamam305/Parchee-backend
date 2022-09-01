const mongoose  = require('mongoose')
const DB_URI = process.env.DB_URI

const connectToDB = () =>{
    mongoose.connect(`${DB_URI}`, () =>{
        console.log('db connected');
    } )
}

module.exports = connectToDB