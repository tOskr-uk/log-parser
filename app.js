const express = require('express');
const app = express();

const encounterRouter = require('./routes/encounterRoutes');

// MIDDLEWARE ALL ROUTES
app.use(express.json());

// MOUNTING ROUTER 
app.use('/api/encounters', encounterRouter);


// EXPORTS
module.exports = app;