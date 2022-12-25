const express = require('express');
const app = express();

const encounterRouter = require('./routes/encounterRoutes');

// MIDDLEWARE ALL ROUTES
app.use(express.json());
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

// MOUNTING ROUTER 
app.use('/api/encounters', encounterRouter);
app.get('/',(req, res)=>{
    res.render('index.ejs');
})


// EXPORTS
module.exports = app;