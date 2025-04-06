
let container = document.querySelector('.container')

let sqmatrix = []

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
      const response = await fetch('new_game/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      let data = await response.json();
      
      sqmatrix[data.extindex[0]][data.extindex[1]].style.backgroundColor = 'green'
      sqmatrix[data.extindex[0]][data.extindex[1]].classList.add('extinguisher')
      sqmatrix[data.fireindex[0]][data.fireindex[1]].style.backgroundColor = 'red'
      sqmatrix[data.fireindex[0]][data.fireindex[1]].classList.add('fire')
      sqmatrix[data.botindex[0]][data.botindex[1]].style.backgroundColor = 'dodgerblue'
      sqmatrix[data.botindex[0]][data.botindex[1]].classList.add('player')
      for(let i=0;i<25;i++){
        for(let j=0;j<25;j++){
            if(data.layout[i][j]==1){
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
    currentposition.classList.remove('player')
    currentposition.style.backgroundColor = 'gray'
    const matrix = Array.from(document.querySelectorAll('.item'));
    let playerIndex = matrix.indexOf(currentposition);
    switch(move){
        case 0:
            matrix[playerIndex+25].style.backgroundColor = 'dodgerblue'
            matrix[playerIndex+25].classList.add('player')
            break;
        case 1:
            matrix[playerIndex-1].style.backgroundColor = 'dodgerblue'
            matrix[playerIndex-1].classList.add('player')
            break;
        case 2:
            matrix[playerIndex-25].style.backgroundColor = 'dodgerblue'
            matrix[playerIndex-25].classList.add('player')
            break;
        case 3:
            matrix[playerIndex+1].style.backgroundColor = 'dodgerblue'
            matrix[playerIndex+1].classList.add('player')
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
        body: JSON.stringify(arr)
        
      });
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