'use strict';
// Creates a series of test files for data analysis to aid in the identification of key strings for performance parse.

// Parses the log file identifed using the inputPath and inputFile paramaters.
// the POI paramater specifies the filter criteria for each output file.
// The outputPath parameter specifies the destination for the files.
// Paramaters are optional and defualt values provided for testing.

const exportToFile = function(
    inputPath = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/',
    inputFile = 'sample-log.txt', 
    outputPath = '/home/toskr/Desktop/projects/EQ2-Parser/test-data/outputs/', 
    poi = ['YOU ', 'YOUR ', 'You ', 'you ', 'Your ', 'your ', 'Garn ', 'Garn\'s', 'Adohi ', 'Adohi\'s']
    ){
        
    const start = Date.now();
    const fs = require('fs');
    // let index, entry, timeStamp;
    const log = fs.readFileSync(`${inputPath}${inputFile}`,{encoding:'utf8', flag:'r'});
    const data = log.split('\n');
    
    for(let i=0;i<poi.length;i++){
        const x = data.filter(val=> val.includes(poi[i]));
        fs.writeFileSync(`${outputPath}${poi[i]}.txt`,x.join(''));
        const end = Date.now();
        console.log(`Data extracted and saved to ${outputPath}${poi[i]}.txt - Process took [${end-start}ms]`);
    }
}

// exportToFile();
// module.exports = exportToFile;