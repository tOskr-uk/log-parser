// // simulates fetching data
// const fetchData = function(){
//     return new Promise((resolve, reject)=>{
//         setTimeout(() => {
//             console.log('Processing complete.');
//             resolve({
//                 id: 1,
//                 message: 'Done!'
//             });
//         }, 2000);
//     });
// };

// // simulates parsing data
// const parseData = function(data){
//     return new Promise((resolve, reject)=>{
//         setTimeout(() => {
//             let parsedOutput = `Parsed data for id:${data.id} with message: ${data.message}`;
//             resolve({ parsed: parsedOutput });
//         }, 2000);
//     });
// };

// // echo the data
// const echoData = function(data){
//     return new Promise((resolve, reject)=>{
//         setTimeout(() => {
//             console.log(data.parsed);
//         }, 2000);
//     });
// };


// fetchData().then(parseData).then(echoData);

// // https://www.youtube.com/watch?v=zu6I2FXakLI


