const fs = require('fs');

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

exports.getTimeStamp = (str)=>{
    return parseInt(str.slice(1, 11));
}

exports.isolateCombatData = (arr)=>{
// removes all non combat elements and returns the array   
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

exports.readFile = (filePath)=>{
    return new Promise((resolve, reject)=>{
        fs.readFile(`${filePath}`,{encoding:'utf8'}, (err, data)=> {
            if(err) reject(err)
            resolve(data) 
        });
    });
}

exports.writeFile = (data)=>{
    return new Promise((resolve, reject)=>{
        const content = data.join('\r\n');
        fs.writeFile('/home/toskr/Desktop/data.txt',content,'utf8',(err)=>{
            if(err) reject(err);
            resolve('File saved.');
        });
    });
}