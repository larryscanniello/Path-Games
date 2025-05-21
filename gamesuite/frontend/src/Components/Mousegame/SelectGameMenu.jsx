
export default function SelectGameMenu(props){
    if(!props.showGameSelection||!props.gameList.current){
        return <></>
    }
    return(
        <ul>
        {props.gameList.current.map(([id,result,date])=><li><button onClick={()=>{
            props.currentGame.current=id;
            props.setShowGameSelection(false);}}>{result + ', ' + date.toString()}</button></li>)}
        </ul>
    )
}