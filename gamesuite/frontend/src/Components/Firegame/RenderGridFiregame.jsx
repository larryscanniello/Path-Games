import '../../Styles/flame.css'


export default function RenderGridFiregame(props){
    const fireGrid = props.fireGrid
    return (
        <div>
          <div className="grid bg-black grid-rows-25 grid-cols-25">
            {fireGrid.map((row, i) =>
              row.map((cell, j) => {
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
                
                return (<div key={`${i},${j}`}>
                  {mod!==2 ? <div
                    key={i*25+j}
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