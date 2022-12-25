const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app')

dotenv.config({path: './config.env'})


// CONNECT TO THE DATABASE
mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
    console.log('Connection to the database has been established.');
})


// START SERVER
const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}...`); 
})