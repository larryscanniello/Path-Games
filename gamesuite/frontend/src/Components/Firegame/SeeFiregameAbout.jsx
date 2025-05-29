import NavBar from "../NavBar"
import { Link } from "react-router-dom"
import FiregameDifficultyMenu from "./FiregameDifficultyMenu"

export default function FiregameAbout(props){

    return(
        <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 z-10">
            <div className="pr-8 pl-8 pb-12">
                <p className="text-purple-300 pt-12">
                    Bot 1 takes the shortest path to the switch, and sticks with it.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 2 takes the shortest path, but replans its path if fire enters its path.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 3 takes the shortest path, but replans if fire enters an adjacent square to one in its path.
                </p>
                <p className="text-purple-300 pt-3">
                    The goal of this project, when it was assigned to me, was to make a more intelligent bot that
                    outperformed these bots. Bot 4 was my attempt. Bot 4 runs 50 simulations
                    and estimates the probability of fire at each square at each time step.  
                    It then runs a search on these weights and does this in a way where, 
                    unlike the other bots,
                    it accounts for where the fire will be at the time the bot will be there.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 5 shows a successful path in hindsight when all of the other bots failed.
                    It looks at the fire progression when it is completed and finds a path.
                    It isn't really a bot, because it isn't making decisions in real-time.
                </p>
                <p className="text-purple-300 pt-3">
                    The difficulty of the levels is determined by bot performance. 
                    By definition, bot 4 succeeds on medium levels and fails on hard levels.
                    Watch medium levels to see where bot 4 outperforms the other bots.
                    Watch hard levels to see where bot 4 (and the other bots) fall short.
                    If you only watch hard levels, this might give you a bad impression of bot 4,
                    but in reality it succeeds more often than the other bots.
                </p>
                <div className="flex flex-col items-center pt-3"><button onClick={()=>props.setShowAbout(false)} className="text-white hover:underline content-center">Close</button></div>
            </div>
        </div>
    )
}