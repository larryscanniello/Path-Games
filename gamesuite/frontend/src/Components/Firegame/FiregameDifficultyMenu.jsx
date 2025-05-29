

export default function FiregameDifficultyMenu(props){
    const levels = ['easy','medium','hard']
    return(
        <div className='text-center text-white'><ul>{levels.map((dif,i)=><li key={i}><button className='hover:underline' 
        onClick={()=>{props.setDifficulty(dif);
            props.setShowInstructions(false);
            }}>New {dif} game</button></li>)}</ul></div>
    )
}