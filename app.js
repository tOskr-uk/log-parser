'use strict';

const fs = require('fs');
const exportParse = require('./export');
let timeStamp = 0;
let encounterArray = [];


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
// MAIN FUNCTION called every time a change is detected in the sourse log file.
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
        
function getTimeStamp(str){
    // takes an entry from the log and returns the entries timestamp
    return parseInt(str.slice(1, 11));
}
        

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
        else if(e.includes(('You have entered'))){ encounterManager(e); }
        else{};
    })
}

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
        // console.log(encounterArray); // <---- 
        
        fs.appendFile(`${testPath}primary.json`,JSON.stringify({data: encounterArray}, null, 2),(err, data)=>{
            if(err){console.log(err);}
            else{
                console.log('File appended.');
            }
        } )
        encounterArray = [];
        encounterArray.push(element);
    }
    timeStamp = elementTimestamp;










}
function parseCombatCheck(arr){
    // checks the array param for combat indicators
    // returns the timestamp of the first positive indicator if present 
    // toggles the global combatStatus variable as required.
    arr.forEach(e => {
        console.log(e);
    });
    return false;
}