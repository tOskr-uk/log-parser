'use strict';
require('./db/mongoose');

const fs = require('fs');
const Encounter = require('./dataModel');

exports.readFile = (filePath)=>{
    // ----------------------------------------------------
    // promisifed fs readFile.
    // ----------------------------------------------------
    return new Promise((resolve, reject)=>{
        fs.readFile(`${filePath}`,{encoding:'utf8'}, (err, data)=> {
            if(err) reject(err)
            resolve(data) 
        });
    });
}

exports.writeFile = (data, path='/home/toskr/Desktop/data.txt')=>{
    // ----------------------------------------------------
    // promisifed fs writeFile.
    // ----------------------------------------------------
    return new Promise((resolve, reject)=>{
        const content = data.join('\r\n');
        fs.writeFile(path, content,'utf8',(err)=>{
            if(err) reject(err);
            resolve('File saved.');
        });
    });
}

exports.getTimeStamp = (str)=>{
    // ----------------------------------------------------
    // extracts and returns the timestamp from a log record
    // ----------------------------------------------------
    return parseInt(str.slice(1, 11));
}

exports.getEncounterName = (str)=>{
    // gets encounter name
    return str.slice(str.indexOf('hit')+4,str.lastIndexOf('for')).trim();
}

exports.isolateCombatData = (arr)=>{
    // ----------------------------------------------------
    // removes all non combat records and returns the array
    // ----------------------------------------------------
    const data = [];    
    let i=0;
    while(i < arr.length){
        if(arr[i].includes('hits a' && 'for' && 'damage')
        || arr[i].includes('You start fighting')
        || arr[i].includes('You stop fighting')
        || arr[i].includes('You have killed a')
        || arr[i].includes('You lose consciousness!')
        || arr[i].includes('tries to' && 'but misses')
        || arr[i].includes('tries to' && 'but' && 'parries')
        || arr[i].includes('tries to' && 'but' && 'resists')
        || arr[i].includes('tries to' && 'but' && 'blocks')
        || arr[i].includes('but YOU resist')
        || arr[i].includes('has killed a')){
            data.push(arr[i])
        }
        i++
    }
    return data;
}

exports.encounterExtraction = async (data, maxDelay=4)=>{
    // ----------------------------------------------------
    // splits the input data into individual encounter objects.
    // 
    // params: data (array) - raw combat log data
    // maxDelay (number, default = 4) - maximum time in seconds that can exist between log entries before a new encounter is identified and created. 
    // ----------------------------------------------------
    
    let arr = [];
    let encounterMax = this.getTimeStamp(data[0])*1 + maxDelay;
    let i=0;
    while(i < data.length){
        if(this.getTimeStamp(data[i])*1 < encounterMax){
            arr.push(data[i])
        } else {
            await this.packageEncounter(arr)
            arr = [];
            arr.push(data[i]);
        }
        encounterMax = this.getTimeStamp(data[i])*1 + maxDelay;
        i++
    }
    await this.packageEncounter(arr);
    console.log('Done');
}

exports.packageEncounter = (arr)=>{
    // receives encounter data as array and returns an encounter object.

    const encounterStart = this.getTimeStamp(arr[0])
    const encounterEnd = this.getTimeStamp(arr[arr.length-1])
    const encounterDuration = encounterEnd - encounterStart;
    const encounterStartTime = new Date(encounterStart*1000);
    const encounterEndTime = new Date(encounterEnd*1000);
    
    let encounterName;
    for(let i=0; i<arr.length; i++){        
        if(arr[i].includes('YOU' && 'hit' && 'for') && arr[i].indexOf('YOU')<arr[i].indexOf('hit')){
            encounterName = arr[i].slice(arr[i].indexOf('hit')+4,arr[i].lastIndexOf('for')).trim();
            break;
        }
    }
    if(!encounterName) encounterName = 'Unknown';
    
    const encounter = new Encounter({
        name: encounterName,
        duration: encounterDuration,
        start: encounterStartTime,
        end: encounterEndTime,
        data: arr
    })
    encounter.save().then().catch(err => console.log(err));
}












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
        const logEntry = new LogEntry({
            name: encounterName,
            duration: encounterDuration,
            combatData: encounterArray,
            // otherData: encounterJunk
        })
    
        // Save to database
        logEntry.save().then(data=>{
            console.log(`closeEncounter called from ${str}`);
            console.log('New record has been added');
        }).catch(err=>{
            console.log(err);
        })
        
        // encounter resets 
        console.log(encounterArray);
        encounterArray = [];
        // encounterJunk = [];   
    }