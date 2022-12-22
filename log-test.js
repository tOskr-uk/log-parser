'use strict';
const tools = require('./src/tools');
const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon';
const file = 'eq2log_Terek.txt';

async function importAll(){
    let data = await tools.readFile(`${path}/${file}`)
    data = data.split(/\r?\n/);
    console.log('Data has been formatted');
    data = tools.isolateCombatData(data);
    console.log('Data has been sorted');
    data = tools.encounterExtraction(data);

    // await tools.writeFile(data);
    // tools.packageEncounter(data);
    // console.log('Data has been processed and saved to file.');
    // console.log(data);
    
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
importAll();
