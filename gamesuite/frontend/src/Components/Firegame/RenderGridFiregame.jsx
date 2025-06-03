import '../../Styles/flame.css'


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
        <div>
          <div className="grid bg-black grid-rows-25 grid-cols-25">
            {grid.map((row, i) =>
              row.map((cell, j) => {
                let img = ''
                let bgColor = '';
                const mod = cell % 10;
                if(mod===0){
                  bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                }
                if(mod===1){
                  bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/glass.png')]"
                }
                if(mod===5){
                  bgColor = "w-8 h-8 border-green-300 bg-[url('/suppresor2.png')]"
                }
                /*
                if (mod === 1) {
                  
                  bgColor = ' bg-black '
                  if(i<24){
                    if(grid[i+1][j]!==1){
                        bgColor += ' border-b-1 border-cyan-100 '
                    }
                  }
                  if(i>0){
                    if(grid[i-1][j]!==1){
                      bgColor += ' border-t-1 border-cyan-100 '
                    }
                  }
                  if(j<24){
                    if(grid[i][j+1]!==1){
                      bgColor += ' bg-black border-r-1 border-cyan-100 '
                    }
                  }
                  if(j>0){
                    if(grid[i][j-1]!==1){
                      bgColor += ' bg-black border-l-1 border-cyan-100 '
                    }
                  }
                }
                else if (mod===2){
                  bgColor += 'bg-red-500 border border-cyan-100'
                } else if (mod === 5) {
                  bgColor = 'bg-green-500 border border-cyan-100';
                } else {
                  bgColor = 'bg-gray-400 border border-cyan-100';
                }
                */
                return (<div key={`${i},${j}`}>
                  {mod!==2 ? <div
                    key={`${i},${j}`}
                    className={`w-8 h-8 relative flex items-center justify-center ${bgColor}`}
                    style={{backgroundSize: '32px 32px'}}
                  >
                    <BotSlot
                      data={props.data}
                      playerIndex={props.playerIndex}
                      currentTurn={props.currentTurn}
                      i={i}
                      j={j}
                    />
                  </div>:<div className='container'><div
                    key={`${i+25},${j+25}`}
                    className={`open-sq`}
                  >
                    <BotSlot
                      data={props.data}
                      playerIndex={props.playerIndex}
                      currentTurn={props.currentTurn}
                      i={i}
                      j={j}
                    />
                  </div><div className='fire-sprite'></div></div>}
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black z-10"
        />
      )}
    </>

    )
}