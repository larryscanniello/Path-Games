
export default function SelectGameMenu(props){
    return(<div className="fixed border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 mb-12 z-10">
        <div className="flex flex-col items-center pr-8 pl-8 pb-6">
          <ul>
          {props.gameList.map(([id, result, difficulty, date], i) => (
                  <li key={id}>
                    <button className="hover:underline" onClick={() => {
                      props.setCurrentGame(id);
                      props.setShowGameSelection(false);
                    }}>
                      {`${i+1}. ${result}, ${difficulty}, ${date.toLocaleString('en-US', {
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
          <div className="pt-3"><button onClick={()=>props.setShowGameSelection(false)} className="text-white hover:underline content-center">Close</button></div>
        </div>
      </div>
    )
}