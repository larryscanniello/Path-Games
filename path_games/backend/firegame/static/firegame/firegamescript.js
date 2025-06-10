
let container = document.querySelector('.container')
let sqmatrix = []
let turncount = 0
let gameid = 0

for(let i=0;i<25;i++){
    let row = []
    for(let j=0;j<25;j++){
        let newsquare = document.createElement('div')
        newsquare.classList.add('item')
        astr = 'item'+i.toString()+','+j.toString()
        newsquare.classList.add(astr)
        row.push(newsquare)
        container.appendChild(newsquare)
    }
    sqmatrix.push(row)
}

startGame();


async function startGame() {
    try {
      const response = await fetch('load_game/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            },
        body: JSON.stringify(difficulty)
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
      sqmatrix[extindex[0]][extindex[1]].style.backgroundColor = 'green'
      sqmatrix[extindex[0]][extindex[1]].classList.add('extinguisher')
      sqmatrix[fireindex[0]][fireindex[1]].style.backgroundColor = 'red'
      sqmatrix[fireindex[0]][fireindex[1]].classList.add('fire')
      sqmatrix[botindex[0]][botindex[1]].style.backgroundColor = 'dodgerblue'
      sqmatrix[botindex[0]][botindex[1]].classList.add('player')
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
        case 'ArrowUp':
            makeMove(2);
        break;
        case 'ArrowDown':
            makeMove(0);
        break;
        case 'ArrowLeft':
            makeMove(1);
        break;
        case 'ArrowRight':
            makeMove(3);
        break;
}
});

async function makeMove(move) {
    let currentposition = document.querySelector('.player')
    const matrix = Array.from(document.querySelectorAll('.item'));
    let playerIndex = matrix.indexOf(currentposition);
    switch(move){
        case 0:
            if(playerIndex<600){
                if(!matrix[playerIndex+25].classList.contains('closed')){
                    matrix[playerIndex+25].style.backgroundColor = 'dodgerblue'
                    matrix[playerIndex+25].classList.add('player')
                    currentposition.classList.remove('player')
                    currentposition.style.backgroundColor = 'lightgray'
                }
            }
            break;
        case 1:
            if(!playerIndex%25==0){
                if(!matrix[playerIndex-1].classList.contains('closed')){
                    matrix[playerIndex-1].style.backgroundColor = 'dodgerblue'
                    matrix[playerIndex-1].classList.add('player')
                    currentposition.classList.remove('player')
                    currentposition.style.backgroundColor = 'lightgray'
                }
            } 
            break;
        case 2:
            if(playerIndex>24){
                if(!matrix[playerIndex-25].classList.contains('closed')){
                    matrix[playerIndex-25].style.backgroundColor = 'dodgerblue'
                    matrix[playerIndex-25].classList.add('player')
                    currentposition.classList.remove('player')
                    currentposition.style.backgroundColor = 'lightgray'        
                }
            }
            break;
        case 3:
            if(!((playerIndex%25)==24)){
                if(!matrix[playerIndex+1].classList.contains('closed')){
                    matrix[playerIndex+1].style.backgroundColor = 'dodgerblue'
                    matrix[playerIndex+1].classList.add('player')
                    currentposition.classList.remove('player')
                    currentposition.style.backgroundColor = 'lightgray'    
                }
            }
            break;
        
    }
    let arr = convertArrToNumbers();
    try {
      const response = await fetch('make_move/', {
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
    for(let i=0;i<25;i++){
        for(let j=0;j<25;j++){
            if(newarr.grid[i][j]==2){
                sqmatrix[i][j].classList.add('fire')
                sqmatrix[i][j].style.backgroundColor = 'red'
            }
        }
    }     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    turncount += 1
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