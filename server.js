'use strict';
const express = require('express');
const app = express();
const port = 5000;

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/fetch-data', function (req, res) {
    res.sendFile('./test-data/outputs/primary.json', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

