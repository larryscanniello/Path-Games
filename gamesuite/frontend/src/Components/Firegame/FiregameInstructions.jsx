import NavBar from "../NavBar"
import { Link } from "react-router-dom"
import FiregameDifficultyMenu from "./FiregameDifficultyMenu"

export default function FiregameInstructions(props){

    return(
        <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 z-10">
            <div className="pr-8 pl-8 pb-12">
                <p className="text-cyan-200 pt-12 pb-12">
                    You are in deep hibernation on an intergalactic voyage on the space ship Archaeopteryx
                    when suddenly, the fire alarm wakes you. 
                    Your ship has a built-in fire suppression system that will douse the fire,
                    but it needs to be activated. 
                    You must avoid the fire and find a path through the ship
                    to the switch to activate the system.
                </p>
                <p className="text-red-200 pb-12">Use arrow keys to navigate through the ship.
                    If you step into a fire square, it's game over.
                </p>
                <p className="text-red-200 pb-12">The fire starts at a random square, and spreads each time you take a step. 
                    Closed squares and the switch cannot catch on fire. An open square with one fire neighbor
                    has a 40% chance of catching on fire. The more fire neighbors (up down left right) an open square has, 
                    the likelier it will catch on fire. The game has no time limit.
                    Success is possible on each map.</p>
                {props.noMoreLevels && <div className="text-white pb-12"> {`You played all the ${props.noMoreLevels} levels. Choose another.`} </div>}
                {(!props.difficulty||props.noMoreLevels) && <FiregameDifficultyMenu difficulty={props.difficulty} setDifficulty={props.setDifficulty} setShowInstructions={props.setShowInstructions}/>}
            </div>
            
        </div>
    )
}