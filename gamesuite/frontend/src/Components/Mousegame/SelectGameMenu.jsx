
export default function SelectGameMenu(props){
    if(!props.showGameSelection||!props.gameList.current){
        return <></>
    }
    return(
        <ul>
        {props.gameList.current.map(([id,result,stoch,date])=><li><button onClick={()=>{
            props.setCurrentGame(id);
            console.log('check1245');
            props.setShowGameSelection(false);}}>{result+', '+stoch+', '+date.toString()+', '+id}</button></li>)}
        </ul>
    )
}