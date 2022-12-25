const btn = document.getElementById('btn');
const eventData = document.querySelector('.event-data')

const request = new XMLHttpRequest();
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
let encounterDataArray;
btn.addEventListener('click',(e)=>{
    e.preventDefault();
    
    request.open('GET','/api/encounters')
    request.send();
    request.addEventListener('load',function(){
        const data = JSON.parse(this.responseText);
        encounterDataArray = data.data.encounters;
        encounterList(encounterDataArray);

        const encounter = document.querySelector('.list');
        encounter.addEventListener('click',(e)=>{
            // console.log('x');
            encounterData(e);
        })
    })
})

console.log('running...');
function encounterList(data){
    const list = document.querySelector('.list');

    data.forEach((e, index) => {
        // list item
        const item = document.createElement('li');
        item.classList.add('item');

        // encounter container
        const encounter = document.createElement('div')
        encounter.setAttribute('id', index);
        encounter.classList.add('encounter');

        // encounter spans 
        const d = new Date(e.start);
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        span1.innerText = `${e.name}`;
        span2.innerText = `[${d.toISOString().slice(11,16)}] [${d.toISOString().slice(0,10)}]`;

        // BUILD ELEMENT
        encounter.appendChild(span1);
        encounter.appendChild(span2);
        item.appendChild(encounter);
        list.appendChild(item);
        
    });
}

function encounterData(data){
    let id;
    if(data.target.classList.contains('encounter')){
        id = (data.target.id);
    } else {
        id = data.target.parentElement.id
    }
    eventData.innerText = JSON.stringify(encounterDataArray[id].data);
    // console.log();

    // console.log(id);
}
