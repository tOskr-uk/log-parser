'use strict';
// require('./db/mongoose');

// const LogEntry = require('./dataModel');

const tools = require('./src/tools');

const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon';
const file = 'eq2log_Terek.txt';

let count;
let lastTimeStamp = 0; // current timestamp
let elementTimeStamp = 0; // last event time stamp
let encounterArray = [];

const lifeSpan = 4; // this is the delay limit between combat entries

async function start(){
    let data = await tools.readFile(`${path}/${file}`)
    data = data.split(/\r?\n/);
    data = tools.isolateCombatData(data)
    await tools.writeFile(data);
    console.log('Data has been processed and saved to file.');

    
    
    // !count?count = data.length:false; // sets count value for first run

    // fs.readFile(`${path}${read}`,{encoding:'utf8'}, (err, data)=> {
    //     if (err) {console.log(err); return };
    //     !count?count = data.length:false; // sets count value for first run
    
    //     let newData = data.slice(data.length - (data.length - count));
    //     if(newData){
    //         newData = newData.split(/\r?\n/);
    //         dataSort(newData);
    //     } else {
    //         if(encounterArray.length > 0){
    //             if(Date.now() >= lastTimeStamp + lifeSpan*1000){
    //                 closeEncounter('setInterval');
    //             }
    //         } 
    //     }
    //     count = data.length;
    //     start();
    // });
}
start();
