import '../../Styles/SensorInfoBoxStyles.css'


export default function SensorInfoBox(props){
    const boxRef = props.boxRef;
    const sensorLog = props.sensorLog

    return (
      <div ref={boxRef} className='info-box'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Sensor Data</span>
            <span><input type='checkbox' checked = {props.showSenses} onChange={(e)=>{
                props.setShowSenses(e.target.checked);
                e.target.blur();
            }}>
            </input>See Data On Map</span>
        </div>
        {/*<div>
          {sensorLog ? sensorLog.map(obj => (
            <div style={{backgroundColor: obj.beep ? 'green' : 'red'}}>
                Sense at position {obj.position[0].toString() + ',' + obj.position[1].toString()} at turn {obj.turn} is {obj.beep ? "positive." : "negative."} </div>
          )) : ""}
          
        </div>*/}
        <div>
        <table border="1">
            <thead>
            <tr>
                <th>Turn</th>
                <th>Position</th>
                <th>Beep</th>
            </tr>
            </thead>
            <tbody>
            {sensorLog.map(obj => (
                <tr onMouseEnter = {() => props.setHoverIndex(obj.position)} onMouseLeave = {() => props.setHoverIndex(null)}>
                <td>{obj.turn}</td>
                <td>{'(' + obj.position[0].toString() + ',' + obj.position[1].toString() + ')'}</td>
                <td style={{backgroundColor: obj.beep ? 'rgb(0,255,0,.5)':'rgb(255,0,0,.5)'}}>{obj.beep ? "Yes" : "No"}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
      </div>
    );
  }