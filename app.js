'use strict';

const { timeStamp } = require('console');
const fs = require('fs');
const exportParse = require('./export');

// const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon/';
// const read = 'eq2log_Terek.txt';
// const read = 'eq2log_Terek (copy).txt';

// exportParse();
const path = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/';
const read = 'sample-log.txt';

// const write = 'test.txt'

// function Change(id, index, timeStamp, entry, processingTime){
//     this.id = id;                            // user generated unique id for for each record
//     this.index = index;                      // index of the entry in the sourse log
//     this.timeStamp = timeStamp;              // timestamp of the entry from the source log as integer
//     this.entry = entry;                      // the log entry
//     this.processingTime = processingTime;    // time taken to process the actions to this point
// }







let combatStatus = false;
const changeArray = [];
let id=0

// ----------------------------------------------------------------------------
// MAIN FUNCTION called every time a change is detected in the sourse log file.
// ----------------------------------------------------------------------------
const interval = 2000;
fs.watchFile(`${path}${read}`,{interval:interval}, ()=>{
    const start = Date.now();
    
    let index, entry, timeStamp;

    // HEAVY STEP - puts the combat log into an array split by utf8 newline char 
    fs.readFile(`${path}${read}`,{encoding:'utf8'}, (err, data)=> {
        if (err) {console.log(err); return };
        data = data.split('\n');

        // gets and sets the last element in the array that has a value and its index
        index = data.length-3;
        entry = data[index];

        // ** Note to self: timestamp in the log is in miliseconds but last 3 digits are removed (last digit is seconds).
        // get timestamp from last record
        timeStamp = getTimeStamp(entry);

        // returns the index of the last entry where the timestamp is less than the last record - the interval value.
        const x = data.findLastIndex(e=> getTimeStamp(e)<timeStamp-interval/1000); 

        // establish combat status
        combatStatus = parseCombatCheck(data.slice(x));   // passes an array of log entries from the the index of x (above) to the end of the log 
        // if this returns a timestamp then combat events start here...

        // if combat status is true then pass evry entry into a new array
        // do this until combat status is false
        // when combat status is false parse the combat array as required.

        const end = Date.now();
        const processingTime = end-start;

        const obj = {id, index, timeStamp, entry, processingTime};
        changeArray.push(obj);

        // console.log(obj);
        // console.log(processingTime);
        id++
    });
            
});
        
function getTimeStamp(str){
    // takes an entry from the log and returns the entries timestamp
    return parseInt(str.slice(1, 11));
}
        
function parseCombatCheck(arr){
    // checks the array for combat indicators
    // returns the timestamp of the first positive indicator if present 
    // toggles the global combatStatus variable as required.
    arr.forEach(e => {
        console.log(e);
    });
    
    return false;
}