

export default function SensorInfoBox(props){
    const boxRef = props.boxRef;
    const sensorLog = props.sensorLog

    return (
      <div className='info-box p-2'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <span><input type='checkbox' checked = {props.showSenses} onChange={(e)=>{
                props.setShowSenses(e.target.checked);
                e.target.blur();
            }}>
            </input>See Data on Map</span>
            <span><input type='checkbox' checked = {props.seePath} onChange={(e)=>{
                props.setSeePath(e.target.checked);
                e.target.blur();
            }}>
            </input>See Path</span>
        </div>
        <div className="flex justify-center items-center pt-2"><span className="font-bold">Sensor Log</span></div>
        
        <div className="w-64 h-48 relative table-container">
        <table className="table-fixed text-center text-cyan-200 border-collapse transform scale-75">
            <thead>
            <tr>
                <th className="px-0 border-b-2 border-gray-700">Turn</th>
                <th className="px-10 py-2 border-b-2 border-gray-700">Position</th>
                <th className="px-4 py-2 border-b-2 border-gray-700">Beep</th>
            </tr>
            </thead>
        </table>
        <div ref={boxRef} className="overflow-y-auto h-[calc(100%-2.5rem)]">
          <table className="table-fixed text-center w-full font-small text-cyan-200 border-collapse transform">
              <tbody className="">
              {sensorLog.map(obj => (
                  <tr onMouseEnter={() => props.setHoverIndex([obj.position,obj.beep])} onMouseLeave={() => {props.setHoverIndex(null);}}>
                  <td>{obj.turn}</td>
                  <td>{'(' + obj.position[0].toString() + ',' + obj.position[1].toString() + ')'}</td>
                  <td className={obj.beep ? 'bg-green-500':'bg-red-500'}>{obj.beep ? "Yes" : "No"}</td>
                  </tr>
              ))}
              </tbody>
          </table>
        </div>
        </div>
      </div>
    );
  }
