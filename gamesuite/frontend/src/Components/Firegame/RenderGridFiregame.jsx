import '../../Styles/FiregameStyles.css'

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
    
    return(
    <div className='container'>
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod===2){
                        bgColor = 'red'
                    } else if(mod===1){
                        bgColor = 'black'
                    } else if(mod===5){
                        bgColor = 'green'
                    }
                    return (<><div 
                    key = {i.toString() + ',' + j.toString()}
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