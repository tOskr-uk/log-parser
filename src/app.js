'use strict';
require('./db/mongoose');

const fs = require('fs');
const Log = require('./model');

// PRODUCTION DATA
// ---------------
const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon/';
const read = 'eq2log_Terek.txt';


// TEST DATA
// ---------
// const path = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/';
// const read = 'sample-log.txt';


// const testPath = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/outputs/';
// let startCount = fs.readFileSync(`${path}${read}`, 'utf8').split('\n').length -2;

let count;
let lastTimeStamp = 0;
let encounterArray = [];
let encounterJunk = [];

// ----------------------------------------------------------------------------
// 1) Monitors the source log file for new entries 
// ----------------------------------------------------------------------------
const interval = 4000;
setInterval(() => {   
    const start = Date.now();
    
    fs.readFile(`${path}${read}`,{encoding:'utf8'}, (err, data)=> {
        if (err) {console.log(err); return };
        !count?count = data.length:false; // sets count value for first run
        
        let newData = data.slice(data.length - (data.length - count));
        if(newData){
            newData = newData.split(/\r?\n/);
            dataFilter(newData);
        }
        count = data.length;
    });
    // console.log();       
}, interval);


// ----------------------------------------------------------------------------
// 2) New entries are filtered for processing
// ----------------------------------------------------------------------------
function dataFilter(arr){
    arr.forEach(e=>{        
        // COMBAT TEST
        if(e.includes('hits a' && 'for' && 'damage')){ encounterManager(e); }
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
            // can be removed when im sure all combat entries have been processed

            // TODO: This will be a huge entry, need to check its needed (maybe check the encounter array length and only add it if it has data in it)
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
    lastTimeStamp===0?lastTimeStamp=elementTimestamp:null; // sets lastTimeStamp variable for first time use. 
    if(elementTimestamp > lastTimeStamp+lifeSpan){
        // console.log('xxxx');
        closeEncounter();  // belongs to the next encounter if true
    } 
    encounterArray.push(element); // encounterArray is reset in the closeEncounter method.
    // console.log(`Array Length: ${encounterArray.length}`);
    lastTimeStamp = elementTimestamp;
}


// Takes a log entry and returns the timestamp 
function getTimeStamp(str){
    return parseInt(str.slice(1, 11));
}

function closeEncounter(){
    // gets encounter duration
    const encounterStart = getTimeStamp(encounterArray[0]); 
    const encounterEnd = getTimeStamp(encounterArray[encounterArray.length-1]); 
    const encounterDuration = encounterEnd-encounterStart; // seconds

    let encounterName;

    // gets encounter name
    for(let i=0; i<encounterArray.length;i++){
        const el = encounterArray[i];
        if(el.includes('YOU' && 'hit' && 'for') && el.indexOf('YOU')<el.indexOf('hit')){
            encounterName = el.slice(el.indexOf('hit')+4,el.lastIndexOf('for')).trim();
            break;
        }
    }

    // Instantiates mongoose data model
    const log = new Log({
        name: encounterName,
        duration: encounterDuration,
        combatData: encounterArray,
        otherData: encounterJunk
    })

    // Save to database
    log.save().then(data=>{
        console.log('New record has been added');
    }).catch(err=>{
        console.log(err);
    })
    
    // encounter resets 
    encounterArray = [];
    encounterJunk = [];   
}