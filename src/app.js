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
let lastTimeStamp = 0; // current timestamp
let elementTimeStamp = 0; // last event time stamp
let encounterArray = [];
let encounterJunk = [];

// ----------------------------------------------------------------------------
// 1) Monitors the source log file for new entries 
// ----------------------------------------------------------------------------
const lifeSpan = 4; // this is the delay 
const interval = 4000;
setInterval(() => {   
}, interval);

function start(){
    // console.trace();
    fs.readFile(`${path}${read}`,{encoding:'utf8'}, (err, data)=> {
        if (err) {console.log(err); return };
        !count?count = data.length:false; // sets count value for first run
    
        let newData = data.slice(data.length - (data.length - count));
        if(newData){
            newData = newData.split(/\r?\n/);
            dataSort(newData);
        } else {
            if(encounterArray.length > 0){
                if(Date.now() >= lastTimeStamp + lifeSpan*1000){
                    closeEncounter('setInterval');
                }
            } 
        }
        count = data.length;
        start();
    });
}
start();



// ----------------------------------------------------------------------------
// 2) New entries are sorted and processed
// ----------------------------------------------------------------------------
function dataSort(arr){
    arr.forEach(e=>{
        if(e.includes('hits a' && 'for' && 'damage')
        || e.includes('You start fighting')
        || e.includes('You stop fighting')
        || e.includes('You have killed a')
        || e.includes('You lose consciousness!')
        || e.includes('tries to' && 'but misses')
        || e.includes('tries to' && 'but' && 'parries')
        || e.includes('tries to' && 'but' && 'resists')
        || e.includes('tries to' && 'but' && 'blocks')
        || e.includes('but YOU resist')
        || e.includes('has killed a')){
            elementTimeStamp = getTimeStamp(e);
            lastTimeStamp = Date.now();
            if(encounterArray.length === 0){
                encounterArray.push(e);
            } else {
                const lets = getTimeStamp(encounterArray[encounterArray.length-1]); // Last Element Time Stamp
                if(elementTimeStamp+lifeSpan > lets){  
                // if true, this event belongs to current encounter
                    encounterArray.push(e);
                } else {
                // this event does NOT belong to this encounter
                    closeEncounter('dataSort (81 - calculated from a new encounter)');
                    encounterArray.push(e);
                }
            }
        } else {
            // non combat entries: check combat encounter status here
            if(encounterArray.length > 0){
                if(getTimeStamp(e) >= elementTimeStamp + lifeSpan){
                    closeEncounter('dataSort (89 - calculated from non combat entries)');
                }
            }
        }
    })
}



function getTimeStamp(str){
    return parseInt(str.slice(1, 11));
}

function closeEncounter(str){
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
        console.log(`closeEncounter called from ${str}`);
        console.log('New record has been added');
    }).catch(err=>{
        console.log(err);
    })
    
    // encounter resets 
    console.log(encounterArray);
    encounterArray = [];
    encounterJunk = [];   
}