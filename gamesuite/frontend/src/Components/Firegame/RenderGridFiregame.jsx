
export default function RenderGridFiregame(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.grid.map(row => [...row]);
    const firelist = props.data.firelist
    const currentTurn = props.currentTurn
    for(let i=0;i<Math.min(firelist.length-1,currentTurn);i++){
        for(let j=0;j<firelist[i].length;j++){
            grid[firelist[i][j][0]][firelist[i][j][1]] += 2;
        };
    };
    

    return (
        <div className>
          <div className="grid bg-gray-300 grid-rows-25 grid-cols-25">
            {grid.map((row, i) =>
              row.map((cell, j) => {
                let img = ''
                let bgColor = '';
                const mod = cell % 10;
                if (mod === 1) {
                  if(i<24){
                    if(grid[i+1][j]!==1){
                        bgColor += 'bg-black border-b-2 border-purple-400 '
                    }
                  }
                  if(i>0){
                    if(grid[i-1][j]!==1){
                      bgColor += 'bg-black border-t-2 border-purple-400 '
                    }
                  }
                  if(j<24){
                    if(grid[i][j+1]!==1){
                      bgColor += 'bg-black border-r-2 border-purple-400 '
                    }
                  }
                  if(j>0){
                    if(grid[i][j-1]!==1){
                      bgColor += 'bg-black border-l-2 border-purple-400 '
                    }
                  }
                }
                else if (mod===2){
                    /*bgColor = 'bg-red-500 border border-cyan-100';*/
                    img = '/1_1.png'
                    if(i<24){
                      if(grid[i+1][j]!==2){
                          bgColor += 'border-b-2 border-orange-600 '
                      }
                    }
                    if(i>0){
                      if(grid[i-1][j]!==2){
                        bgColor += 'border-t-2 border-orange-600 '
                      }
                    }
                    if(j<24){
                      if(grid[i][j+1]!==2){
                        bgColor += 'border-r-2 border-orange-600 '
                      }
                    }
                    if(j>0){
                      if(grid[i][j-1]!==2){
                        bgColor += 'border-l-2 border-orange-600 '
                      }
                    }
                    bgColor += 'bg-red-500'
                } else if (mod === 5) {
                  bgColor = 'bg-green-500 border border-cyan-100';
                  img = './tile_0515.png'
                } else {
                  bgColor = 'bg-gray-300 border border-cyan-100';
                }
      
                return (
                  <div
                    key={`${i},${j}`}
                    className={`w-8 h-8 relative flex items-center justify-center ${bgColor}`}
                  >
                    {grid[i][j]===2 && <img src={img} className="w-full h-full object-contain"></img>}
                    {grid[i][j]===5 && <img src={img}></img>} 
                    <BotSlot
                      data={props.data}
                      playerIndex={props.playerIndex}
                      currentTurn={props.currentTurn}
                      i={i}
                      j={j}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
}

function BotSlot(props){
    const playerIndex = props.playerIndex
    const isPlayerHere = playerIndex[0] === props.i && playerIndex[1] === props.j;

    
    return(<>
        {isPlayerHere && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-600"
        />
      )}
    </>

    )
}