'use strict';

// TOOLS MODULE
// ------------
// Options to the command line when calling this module...
// Delete the encounters collection     <path to this file> --delete
// Process and import the combat log    <path to this file> --import

// ** uses the process.argv array to check which option is passed and then executes the appropriate function.




const mongoose = require('mongoose');
const Encounter = require('./../models/encounterModel');
const fs = require('fs')

const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const logPath = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon';
const logFile = 'eq2log_Terek.txt';
const jsonPath = '/home/toskr/Desktop'
const jsonFile = 'combatData.json'

// CONNECT TO THE DATABASE
mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
    console.log('Database connection established...');
})

const importJSON = async () => {
    // importData - import local json data into the db
    const encounters = JSON.parse(fs.readFileSync(`${jsonPath}/${jsonFile}`,'utf-8'));
    try{
        await Encounter.create(encounters);
        console.log('Data succesfully imported to database.');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

const deleteData = async ()=>{
    try{
        await Encounter.deleteMany();
        console.log('Data deleted.');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

const processLogFile = ()=>{
    // PROCESS CHARACTER LOGFILE
    // -------------------------
    // 1) purge log of non-combat data, 
    // 2) identify and save unique encounters, 
    // 3) export as local json file or save to DB

    const maxDelay = 4;

    const startTimer = Date.now();

    // IMPORT LOG DATA
    console.log('Reading data from log file...');
    let data = fs.readFileSync(`${logPath}/${logFile}`,'utf-8');

    // PROCESSING LOG DATA
    console.log('Processing log data...');
    const arr = [];        
    data = data.split(/\r?\n/);
    const recordCount = data.length;
    let i=0

    // PURGE NON-COMBAT DATA
    console.log('Purging non-combat data...');
    while(i<data.length){
        // I did experiment with for forEach and for loop. No significant difference in performance but while loop consistantly won by 10ms.
        if(data[i].includes('hits a' && 'for' && 'damage')
        || data[i].includes('You start fighting')
        || data[i].includes('You stop fighting')
        || data[i].includes('You have killed a')
        || data[i].includes('You lose consciousness!')
        || data[i].includes('tries to' && 'but misses')
        || data[i].includes('tries to' && 'but' && 'parries')
        || data[i].includes('tries to' && 'but' && 'resists')
        || data[i].includes('tries to' && 'but' && 'blocks')
        || data[i].includes('but YOU resist')
        || data[i].includes('has killed a')){
            arr.push(data[i])
        }
        i++
    };

    // GROUPING COMBAT DATA
    console.log('Isolating unique encounters...');
    data = [];
    let encounterArr=[];
    let encounterMax = arr[0].slice(1,11)*1 + maxDelay;
    i=0;
    while(i<arr.length){
        if(arr[i].slice(1,11)*1 < encounterMax){ 
            encounterArr.push(arr[i]);
        } else { 
            data.push(buildEncounterObject(encounterArr));
            encounterArr = [];
            encounterArr.push(arr[i]);
        }
        encounterMax = arr[i].slice(1, 11)*1 + maxDelay;
        i++
    }
    const endTimer = Date.now();

    // EXPORTING AS JSON TO DESKTOP
    console.log(`Saving file to ${jsonPath}/${jsonFile}.`);
    fs.writeFileSync(`${jsonPath}/${jsonFile}`,JSON.stringify(data));

    console.log(`Task complete.\nProcessed ${recordCount} log entries in ${endTimer-startTimer}ms\n${data.length} unique combat objects created and exported to ${'xxx'}.`);
}



// --------------------------------------
// UTILITIES
// --------------------------------------
function buildEncounterObject(arr){
    // 1) build encounter object
        // a) get encounter name
        // b) duration
        // c) start time
        // d) end time
        // e) data
    
    // ENCOUNTER START
    const encounterStart = arr[0].slice(1,11)*1;
    
    // ENCOUNTER END
    const encounterEnd = arr[arr.length-1].slice(1,11)*1;
    
    // ENCOUNTER NAME
    let encounterName
    for(let i=0; i<arr.length; i++){        
        if(arr[i].includes('YOU' && 'hit' && 'for') && arr[i].indexOf('YOU')<arr[i].indexOf('hit')){
            encounterName = arr[i].slice(arr[i].indexOf('hit')+4,arr[i].lastIndexOf('for')).trim();
            break;
        }
    }
    if(!encounterName) encounterName = 'Unknown';

    // ENCOUNTER DURATION
    const encounterDuration = encounterEnd - encounterStart;

    return {
        name: encounterName,
        duration: encounterDuration,
        start: new Date(encounterStart*1000),
        end: new Date(encounterEnd*1000),
        data: arr
    }
}

if(process.argv[2] === '--import'){
    processLogFile();
    importJSON();
} else if(process.argv[2] === '--delete'){
    deleteData();
}