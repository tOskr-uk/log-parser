const fs = require('fs')

// BUILDING A PROMISE - Adapting the fs.readFile method that uses a callback function to return a Promise.
const readFilePromise = file=>{
    return new Promise((resolve, reject)=>{
        setTimeout(() => {  // setTimeout has just been added to simulate a delay.
            fs.readFile(file,{encoding:'utf8'},(err, data)=>{
                if(err) reject('Cant find this file.')
                resolve(data)
            })
        }, 2000);
    })
}


// CONSUMING PROMISES USING ASYNC AWAIT
// Async function will automaticaly return a promise so there is no need to return one like the Promise example.
const getFileAsync = async ()=>{
    console.log('Fetching file...');
    const data = await readFilePromise('/home/toskr/Documents/Untitled.txt') // await keyword halts the code until the promise is resolved
    console.log(data);
    console.log('File download complete.');
}
getFileAsync()





// console.log('Fetching file...');
// readFilePromise('/home/toskr/Documents/Untitled.txt').then(data=>{
//     console.log(data);
//     console.log('File download complete.');
// }).catch(err=>{
//     console.log(err);
// })
