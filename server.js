const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app')

dotenv.config({path: './config.env'})


// CONNECT TO THE DATABASE
mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
    console.log('Connection to the database has been established.');
})








// app.use(express.json());


// app.get('/',(req, res)=>{
//     res.render('../public/index');
// })

// app.get('/data', async(req, res)=>{
//     try{
//         const data = await Log.find({});
//         res.status(201).send(data);
//     } catch(err){
//         res.status(500).send(err);
//     }
// })




// START SERVER
const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}...`); 
})