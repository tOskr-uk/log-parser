'use strict';

const fs = require('fs');
const path = '/home/toskr/Desktop/';
const outputPath = '/home/toskr/Desktop/projects/EQ2-Parser/outputs/';

const read = 'test log.txt';
const poi = ['YOU ', 'YOUR ', 'You ', 'you ', 'Your ', 'your ', 'Garn ', 'Garn\'s', 'Adohi ', 'Adohi\'s'];

const start = Date.now();
let index, entry, timeStamp;
const log = fs.readFileSync(`${path}${read}`,{encoding:'utf8', flag:'r'});
const data = log.split('\n');

for(let i=0;i<poi.length;i++){
    const x = data.filter(val=> val.includes(poi[i]));
    fs.writeFileSync(`${outputPath}${poi[i]}.txt`,x.join(''));
}