const fs = require('fs');

const fullPath = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/sample-log.txt';
let data = fs.readFileSync(fullPath, 'utf8');

// console.log(typeof(data));
// console.log(data.length);

data = data.split('\n');
// console.log(typeof(data));
// console.log(data.length);

const startCount = fs.readFileSync(`${fullPath}`, 'utf8').split('\n').length -3;
console.log(data[startCount]);