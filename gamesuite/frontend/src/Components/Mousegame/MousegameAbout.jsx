export default function MousegameAbout(props){
    return(
        <div className="border border-gray-300 bg-gray-800/90 mt-56 ml-18 mr-24 text-sm text-purple-100 rounded-md">
            <div className="pr-8 pl-8 pb-12">
            <p className="pt-12 ">
                Jeff is bot 4, whose initial strategy is to maximize information gain.
            </p>
            <p className="pb-8">
                To see the bots and hear more about them, go to See Mouse Bots.
            </p>
            <p>
                In stationary mouse mode, be sure to use the See Path function. In
            </p>
            <p>
                stochastic mouse mode, the mouse has an equal chance of moving to 
            </p>
            <p>
                an adjacent square or staying still. On average, the mouse will not
            </p>
            <p className="pb-8">
                go far in a short period of time.
            </p> 
            <p>
                See Data on Map shows the ratio of beeps to total senses at each space
            </p>
            <p>
                you have sensed at. If no beeps at a square, it is colored red. The more 
            </p>
            <p >
                beeps, the darker green the square is. Be careful using it in stochastic
            </p>
            <p className="pb-8">
                mouse mode.
            </p>
            <div className="flex flex-col items-center"><button onClick={()=>props.setShowAbout(false)} className="text-white hover:underline content-center">Close</button></div>
            </div>
        </div>
    )
}

