'use strict';

const { timeStamp } = require('console');
const fs = require('fs');
const exportParse = require('./export');

// const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon/';
// const read = 'eq2log_Terek.txt';
// const read = 'eq2log_Terek (copy).txt';

exportParse();
const path = '/home/toskr/Desktop/';
const read = 'test log.txt';

// const write = 'test.txt'

function Change(id, index, timeStamp, entry, processingTime){
    this.id = id;
    this.index = index;
    this.timeStamp = timeStamp;
    this.entry = entry;
    this.processingTime = processingTime;
}

let combatStatus = false;
// const poi = [YOU, YOUR];
const changeArray = [];
let id=0
const interval = 3000;
fs.watchFile(`${path}${read}`,{interval:interval}, ()=>{
    const start = Date.now();
    let index, entry, timeStamp;
    const log = fs.readFileSync(`${path}${read}`,{encoding:'utf8', flag:'r'});
    const data = log.split('\n');


    index = data.length-3;
    entry = data[index];

    // get timestamp from last record
    timeStamp = getTimeStamp(entry);
    
    // go back at least the time of the interval value
    // ** Note to self: timestamp in the log is in miliseconds but last 3 digits are removed (last digit is seconds).
    const x = data.findLastIndex(e=> getTimeStamp(e)<timeStamp-interval/1000); // gets index of first record match
    console.log(data[x]);
    
    
    // cycle through each record to determine combat status
    combatStatus = parseCheck(data.slice(x));


    
    // establish combat status
    // if combat status has changed toggle combat flag

    // if combat status is true then pass evry entry into a new array
    // do this until combat stays is false
    // when combat status is false parse the combat array as required.



    const end = Date.now();
    const processingTime = end-start;
    const obj = {id, index, timeStamp, entry, processingTime};
    // const obj = new Change(i, index, timeStamp, entry, `${timer}ms`)
    changeArray.push(obj)
    console.log(obj);
    // console.log(entry);
    id++

});

function getTimeStamp(str){
    // takes an entry from the log and returns the entries timestamp
    return parseInt(str.slice(1, 11));
}

function parseCheck(arr){
    // checks the string for combat indicators
    // returns true if present
    arr.forEach(e => {
        console.log(e);
    });

    return false;
}


// const milisec = 1667507312;
// console.log(new Date(1667507312));
// console.log(Date.now());

console.log(Date.parse('Thu Nov  3 21:18:39 2022'));