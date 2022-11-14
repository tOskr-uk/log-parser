// Parses a complete log file seperating entries into their own arrays based 
// on their contextual relevance then exports then to indivisual files. 

const fs = require('fs');

// TEST DATA
// const path = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/';
// const file = 'sample-log.txt';

// LIVE DATA
const path = '/home/toskr/.steam/debian-installation/steamapps/common/EverQuest 2/logs/Varsoon/';
const file = 'eq2log_Terek.txt';

const outputPath = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/';

const start = Date.now();


let data = fs.readFileSync(`${path}${file}`, 'utf8');


data = data.split(/\r?\n|\r|\n/g);
const arrA = []; 
const arrB = []; 
const arrC = []; 
const arrD = []; 
const arrZ = []; 

data.forEach(e=>{
    // combat [A]
    if(e.includes('hits a' && 'for' && 'damage')){ arrA.push(e);}
    else if(e.includes(('You start fighting'))){ arrA.push(e); }
    else if(e.includes(('You stop fighting'))){ arrA.push(e); }
    else if(e.includes(('You have killed a'))){ arrA.push(e); }
    else if(e.includes(('You lose consciousness!'))){ arrA.push(e); }
    else if(e.includes(('tries to' && 'but misses'))){ arrA.push(e); }
    else if(e.includes(('tries to' && 'but' && 'parries'))){ arrA.push(e); }
    else if(e.includes(('tries to' && 'but' && 'resists'))){ arrA.push(e); }
    else if(e.includes(('tries to' && 'but' && 'blocks'))){ arrA.push(e); }
    else if(e.includes(('but YOU resist'))){ arrA.push(e); }
    else if(e.includes(('has killed a'))){ arrA.push(e); }
    else if(e.includes(('You have entered'))){ arrA.push(e); }

    // hp and mana regen [B]
    else if(e.includes('heals' && 'for' && 'hit points')){ arrB.push(e);}
    else if(e.includes('refreshes' && 'mana points')){ arrB.push(e);}

    // hate [C]
    else if(e.includes('increases THEIR hate' && 'threat')){ arrC.push(e);}

    // loot [D]
    else if(e.includes('wins the lotto for')){ arrD.push(e);}
    else if(e.includes('win the lotto for')){ arrD.push(e);}
    else if(e.includes('chose GREED')){ arrD.push(e);}
    else if(e.includes('Now rolling on')){ arrD.push(e);}
    else if(e.includes('choose GREED and roll')){ arrD.push(e);}
    else if(e.includes('chooses GREED and rolls')){ arrD.push(e);}
    else if(e.includes('You chose NEED')){ arrD.push(e);}
    else if(e.includes('You loot' && 'from the corpse of')){ arrD.push(e);}
    else if(e.includes('looted the' && '\aITEM')){ arrD.push(e);}
    else if(e.includes('You disarm the trap')){ arrD.push(e);}

    // discard
    else if(e.includes(('Your target is too far away!  Move closer!'))){}
    else if(e.includes(('Your faction standing with'))){}
    else if(e.includes(('earned the achievement'))){}
    else if(e.includes(('You tell'))){}
    else if(e.includes(('You cannot see your target'))){}
    else if(e.includes(('Guildmate:' && 'has logged in'))){}
    else if(e.includes(('Guildmate:' && 'has logged out'))){}
    else if(e.includes(('You send your pet in for the attack!'))){}
    else if(e.includes(('\aPC'))){}
    else if(e.includes(('\aNPC'))){}
    else if(e.includes(('Too little too late...  Your target is already dead.'))){}
    else if(e.includes(('There is no eligible target'))){}

    // all else
    else{ arrZ.push(e); }

});

// Write files
fs.writeFileSync(`${outputPath}A-COMBAT.txt`, arrA.join('\n'));
console.log('Writing file A.txt complete');
fs.writeFileSync(`${outputPath}B-REGEN.txt`, arrB.join('\n'));
console.log('Writing file B.txt complete');
fs.writeFileSync(`${outputPath}C-HATE.txt`, arrC.join('\n'));
console.log('Writing file C.txt complete');
fs.writeFileSync(`${outputPath}D-LOOT.txt`, arrD.join('\n'));
console.log('Writing file D.txt complete');
fs.writeFileSync(`${outputPath}Z-REMAINDER.txt`, arrZ.join('\n'));
console.log('Writing file Z.txt complete');

const end = Date.now();
console.log(`Task Duration: ${end-start}ms`);

