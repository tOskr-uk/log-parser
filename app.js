'use strict';

// 1) Monitors the log file for new entries
// 2) New entries are filtered for processing
// 3) Data is organised into encounters
// 4) Enccounters are saved in the db


const fs = require('fs');
const exportParse = require('./export');
let timeStamp = 0;
let encounterArray = [];
let encounterJunk = [];


// ---------------
// PRODUCTION DATA
// ---------------
const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon/';
// const read = 'eq2log_Keplan.txt';
const read = 'eq2log_Terek.txt';
// const read = 'eq2log_Qzvx.txt';


// ---------
// TEST DATA
// ---------
// const path = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/';
// const read = 'sample-log.txt';


const testPath = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/outputs/';
let startCount = fs.readFileSync(`${path}${read}`, 'utf8').split('\n').length -2;

let combatStatus = false;
const changeArray = [];
let id=0


// ----------------------------------------------------------------------------
// 1) Monitors the source log file for new entries 
// ----------------------------------------------------------------------------
const interval = 4000;
fs.watchFile(`${path}${read}`,{interval:interval}, ()=>{
    const start = Date.now();
    
    let index, record, timeStamp;

    // HEAVY STEP - puts the combat log into an array split by utf8 newline char 
    fs.readFile(`${path}${read}`,{encoding:'utf8'}, (err, data)=> {
        if (err) {console.log(err); return };
        data = data.split('\n');
        index = data.length-2;
        record = data[index];

        // Isolates new records and forwards for processing 
        if(startCount === index) return
        dataFilter(data.slice(startCount+1, index+1)); // +1 is to include the last record (0 based). Not to be confused with the logCalibration value 
        startCount = index;
    });
            
});


// ----------------------------------------------------------------------------
// 2) New entries are filtered for processing
// ----------------------------------------------------------------------------
function dataFilter(arr){
    arr.forEach(e=>{
        
        // *ATTENTION* - Need a cleaner way to do this
        // COMBAT TEST
        if(e.includes('hits a' && 'for' && 'damage')){ encounterManager(e);}
        else if(e.includes(('You start fighting'))){ encounterManager(e); }
        else if(e.includes(('You stop fighting'))){ encounterManager(e); }
        else if(e.includes(('You have killed a'))){ encounterManager(e); }
        else if(e.includes(('You lose consciousness!'))){ encounterManager(e); }
        else if(e.includes(('tries to' && 'but misses'))){ encounterManager(e); }
        else if(e.includes(('tries to' && 'but' && 'parries'))){ encounterManager(e); }
        else if(e.includes(('tries to' && 'but' && 'resists'))){ encounterManager(e); }
        else if(e.includes(('tries to' && 'but' && 'blocks'))){ encounterManager(e); }
        else if(e.includes(('but YOU resist'))){ encounterManager(e); }
        else if(e.includes(('has killed a'))){ encounterManager(e); }

        else{
            // temporary dump for non combat entries for analysis and verification
            // will be removed when im sure all combat entries have been processed
            encounterJunk.push(e);
        };
    })
}


// ----------------------------------------------------------------------------
// 3) Data is organised into encounters
// ----------------------------------------------------------------------------
function encounterManager(element){
    const lifeSpan = 5; // this is the delay 
    
    // determine which encounter it belolongs to
    const elementTimestamp = getTimeStamp(element);
    timeStamp===0?timeStamp=elementTimestamp:null; // sets timeStamp variable for first time use. 
    if(timeStamp+lifeSpan > elementTimestamp){
        // belongs to the managed encounter
        encounterArray.push(element);
    } else {
        // is a new encounter
        
        // encounter is closed and saved to db
        // get name and duration of encounter


        fs.appendFile(`${testPath}primary.json`,JSON.stringify({data: encounterArray}, null, 2),(err, data)=>{
            if(err){console.log(err);}
            else{
                console.log('File appended.');
            }
        } )

        // encounter resets 
        encounterArray = [];
        encounterJunk = [];
        encounterArray.push(element);
        
    }
    timeStamp = elementTimestamp;










}


// Takes a log entry and returns the timestamp 
function getTimeStamp(str){
    return parseInt(str.slice(1, 11));
}