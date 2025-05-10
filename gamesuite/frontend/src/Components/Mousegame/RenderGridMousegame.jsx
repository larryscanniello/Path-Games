import '../../Styles/FiregameStyles.css'

export default function RenderGridMousegame(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.game.grid.map(row => [...row])
    const turn = props.turn
    const playerIndex = props.playerIndex
    const playerPath = props.playerPath
    for(let i=0;i<playerPath.length;i++){
        grid[playerPath[i][0]][playerPath[i][1]]=3
    }
    return(
    <div className='container'>
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod===1){
                        bgColor = 'black'
                    } else if(mod===3){
                        bgColor = 'seashell'
                    }
                    return (<><div 
                    className= 'item'
                    style={{
                        backgroundColor: bgColor
                    }}
                    >
                    <BotSlot data={props.data} playerIndex={props.playerIndex} currentTurn={props.currentTurn} i={i} j={j}/></div>
                    </>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const playerIndex = props.playerIndex
    let playerSpace = {}
    if(playerIndex[0]===props.i && playerIndex[1]===props.j){
        playerSpace = { id: 0, position: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'blue' }
    }

    const botStyle = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'blue',
    };
    return(<>
        <div
        key = {playerSpace.id}
        style ={{
            ...botStyle,
            ...playerSpace.position,
            backgroundColor: playerSpace.color
        }}
        ></div>
    </>

    )
}