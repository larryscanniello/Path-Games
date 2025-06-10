
let container = document.querySelector('.container')
let sqmatrix = []
let turncount = 0
let gameid = 0
let playtracker = 0
let intervalID = 0
botsintrial = []

for(let i=0;i<25;i++){
    let row = []
    for(let j=0;j<25;j++){
        let newsquare = document.createElement('div')
        let newlayer1 = document.createElement('div')
        let newlayer2 = document.createElement('div')
        let newlayer3 = document.createElement('div')
        let newlayer4 = document.createElement('div')

        newsquare.classList.add('item')
        astr = 'item'+i.toString()+','+j.toString()
        newsquare.classList.add(astr)
        newlayer1.classList.add('layer1')
        newlayer2.classList.add('layer2')
        newlayer3.classList.add('layer3')
        newlayer4.classList.add('layer4')

        newsquare.appendChild(newlayer1)
        newlayer1.appendChild(newlayer2)
        newlayer2.appendChild(newlayer3)
        newlayer3.appendChild(newlayer4)
        row.push(newsquare)
        container.appendChild(newsquare)
    }
    sqmatrix.push(row)
}

startGame();


async function startGame() {
    try {
      const response = await fetch('load_see_bots/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            },
        body: '',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      let data = await response.json();
      extindex = JSON.parse(data.extindex)
      fireindex = JSON.parse(data.fireindex)
      botindex = JSON.parse(data.botindex)
      layout = JSON.parse(data.layout)
      gameid = JSON.parse(data.gameid)
      botsintrial = data.botsintrial
      sqmatrix[extindex[0]][extindex[1]].style.backgroundColor = 'green'
      sqmatrix[extindex[0]][extindex[1]].classList.add('extinguisher')
      sqmatrix[fireindex[0]][fireindex[1]].style.backgroundColor = 'red'
      sqmatrix[fireindex[0]][fireindex[1]].classList.add('fire')
      const botColors = ['blue','dodgerblue','cyan','fuchsia','darkmagenta']
      const botNames = ['successpossiblebot','bot1','bot2','bot3','bot4']
      botindexsq = sqmatrix[botindex[0]][botindex[1]]
      for(let i=0;i<5;i++){
        if(data.botsintrial[i]!==false){
            botindexsq.classList.add(botNames[i])
            botindexsq.style.backgroundColor = botColors[i]
            botindexsq = botindexsq.firstChild
        }
      }
      for(let i=0;i<25;i++){
        for(let j=0;j<25;j++){
            if(layout[i][j]==1){
                sqmatrix[i][j].style.backgroundColor = 'black'
                sqmatrix[i][j].classList.add('closed')
            }
        }
    }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowRight':
            goForward();
        break;
        case 'Space':
            if(playtracker===0){
                intervalID = setInterval(goForward,500)
                playtracker = 1
            }
            else{
                clearInterval(intervalID)
                playtracker = 0
            }
        break;
        case 'ArrowLeft':
            goBackward()
        break;
}
});

let isRunning = false;

async function goForward() {
    if(isRunning) return;
    isRunning = true;
    let currentposition = document.querySelector('.player')
    const matrix = Array.from(document.querySelectorAll('.item'));
    let playerIndex = matrix.indexOf(currentposition);
    let arr = convertArrToNumbers();
    try {
      const response = await fetch('go_forward/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            'grid': arr,
            'turncount': turncount,
            'gameid': gameid
        })});
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      } 
    const data = await response.json()
    grid = data['grid']
    for(let i=0;i<25;i++){
        for(let j=0;j<25;j++){
            if(grid[i][j]==2){
                sqmatrix[i][j].classList.add('fire')
                sqmatrix[i][j].style.backgroundColor = 'red'
            }
        }
    
    }
    indices = data['indices']
    const classNames = ['successpossiblebot', 'bot1', 'bot2', 'bot3', 'bot4'];
    let botdivs = []
    classNames.forEach((className,k) => {
        if(botsintrial[k]!==false){
            const element = document.querySelector(`.${className}`);
            if (!element) return;
            botdivs.push(element);
            element.style.backgroundColor = element.classList.contains('fire') ? 'red' : 'lightgrey';
        }
    })
    console.log(botdivs)
    const indexnames = ['successpossibleindex','bot1index','bot2index','bot3index','bot4index']
    const backgroundcolors = ['blue','dodgerblue','cyan','fuchsia','darkmagenta']
    indexnames.forEach((name,k) => {
        if(botsintrial[k]!==false&&!botdivs[0].classList.contains('.fire')){
            let index = indices[name];
            console.log(index)
            currentdiv = sqmatrix[index[0]][index[1]];
            for(let i=0;i<k;i++){
                currentdiv = currentdiv.firstChild;
            };
            botdivs[k].classList.remove(classNames[k]);
            console.log('currentdiv: ',currentdiv)
            currentdiv.style.backgroundColor = backgroundcolors[k];
            currentdiv.classList.add(classNames[k]);
        }
    
    })

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    turncount += 1
    isRunning = false;
  }

async function goBackward(){
    if(isRunning) return;
    isRunning = true;
    let currentposition = document.querySelector('.player')
    const matrix = Array.from(document.querySelectorAll('.item'));
    let playerIndex = matrix.indexOf(currentposition);
    let arr = convertArrToNumbers();
    try {
      const response = await fetch('go_backward/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            'grid': arr,
            'turncount': turncount,
            'gameid': gameid
        })});
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      } 
    
    const newarr = await response.json()
    grid = newarr['grid']
    for(let i=0;i<25;i++){
        for(let j=0;j<25;j++){
            if(grid[i][j]==0){
                sqmatrix[i][j].classList.remove('fire')
                sqmatrix[i][j].style.backgroundColor = 'lightgrey'
            }
        }
    
    }
    newindex = newarr['successpossiblepathindex']
    if(newindex[0] !==-1){
        const classNames = ['successpossiblebot', 'bot1', 'bot2', 'bot3', 'bot4'];
        classNames.forEach(className => {
            const element = document.querySelector(`.${className}`);
            if (!element) return;
            element.style.backgroundColor = element.classList.contains('fire') ? 'red' : 'lightgrey';
        })

        sqmatrix[newindex[0]][newindex[1]].style.backgroundColor = 'blue'
        sqmatrix[newindex[0]][newindex[1]].classList.add('successpossiblebot')
        oldspindex.classList.remove('successpossiblebot')
    }
    

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    if(turncount!==0){
        turncount -= 1
    }
    isRunning = false;
}

function convertArrToNumbers(){
    let numberarr = []
    for(let i=0;i<25;i++){
        let row = []
        for(let j=0;j<25;j++){
            if(sqmatrix[i][j].classList.contains('closed')){
                row.push(1)
            }
            else if(sqmatrix[i][j].classList.contains('fire')){
                row.push(2)
            }
            else if(sqmatrix[i][j].classList.contains('extinguisher')){
                row.push(5)
            }
            else{
                row.push(0)
            }
        }
        numberarr.push(row)
    }
    return numberarr
}