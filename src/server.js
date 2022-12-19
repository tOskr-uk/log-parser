const express = require('express');
const Log = require('./model');
require('./db/mongoose') // runs the file directly from here

const app = express();
app.set('view engine', 'ejs')


app.use(express.json());


app.get('/',(req, res)=>{
    res.render('../public/index');
})

app.get('/data', async(req, res)=>{
    try{
        const data = await Log.find({});
        res.status(201).send(data);
    } catch(err){
        res.status(500).send(err);
    }
})




// SERVER
const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}...`); 
})