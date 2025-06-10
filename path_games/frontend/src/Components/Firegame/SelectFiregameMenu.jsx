
export default function SelectGameMenu(props){
    if(!props.showGameSelection||!props.gameList.current){
        return <></>
    }
    return(
        <ul>
        {props.gameList.current.map(([id,result,difficulty,date])=><li><button onClick={()=>{
            props.currentGame.current=id;
            props.setShowGameSelection(false);}}>{id + ', ' + result + ', ' + difficulty + ', ' + date.toString()}</button></li>)}
        </ul>
    )
}