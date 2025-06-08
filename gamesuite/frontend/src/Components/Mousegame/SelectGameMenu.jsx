
export default function SelectGameMenu(props){
    return(<div className="fixed bg-gray-800/90 ml-17 mr-24 mb-12 z-10 rounded-md">
        <div className="m-6">Select game to watch:</div>
        <div ref={props.showGameRef} className="flex flex-col items-center overflow-y-auto h-96 pr-8 pl-8 pb-6 text-white">
          <ul>
          {props.gameList.map(([id, result, stoch, date, winrate], i) => (
                  <li key={id}>
                    <button className={id===props.currentGame ? "text-green-300 hover:underline" : "hover:underline"} onClick={() => {
                      props.setCurrentGame(id);
                      props.setShowGameSelection(false);
                      props.winRateRef.current = winrate
                    }}>
                      {`${i+1}. ${result}, Map ID: ${id}, ${stoch ? 'moving mouse':'stationary mouse'}, ${date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`}
                    </button>
                  </li>
                ))}
          </ul>
          
        </div>
        <div className="flex flex-col items-center"><div className="pt-4 pb-4"><button onClick={()=>props.setShowGameSelection(false)} className="text-white hover:underline content-center">Close</button></div></div>
      </div>
    )
}