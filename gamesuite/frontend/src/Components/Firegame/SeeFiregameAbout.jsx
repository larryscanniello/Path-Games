import NavBar from "../NavBar"
import { Link } from "react-router-dom"
import FiregameDifficultyMenu from "./FiregameDifficultyMenu"

export default function FiregameAbout(props){

    return(
        <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 z-10">
            <div className="pr-8 pl-8 pb-8">
                <p className="text-purple-200 pt-12">
                    Bot 1 plans a shortest path to the switch at the start, and sticks with it no matter what.
                </p>
                <p className="text-purple-200 pt-3">
                    Bot 2 plans a new shortest path at every time step, taking the current fire spread into account.
                </p>
                <p className="text-purple-200 pt-3">
                    Bot 3 plans a new shortest path at each time step and avoids fire adjacent squares if possible.
                </p>
                <p className="text-purple-200 pt-3">
                    The goal of this project, when it was assigned to me, was to make a more intelligent bot that
                    outperformed the above bots. Bot 4 was my attempt. Bot 4 runs 50 simulations
                    at the start of the game and estimates the probability of fire at each square at each time step.  
                    It then runs a spatiotemporal search on these weights to get its path. Unlike the other bots, it
                    accounts for where the fire will be at the time the bot will be there.
                    If fire enters an adjacent square to one in the bot's plan, it reverts to doing what bot 3 would do.
                </p>
                <p className="text-purple-200 pt-3">
                    Bot 5 shows a successful path in hindsight when all of the above bots have failed.
                    It looks at the fire progression when it is completed and finds a path.
                    It isn't really a bot, because it isn't making decisions in real-time.
                </p>
                <p className="text-purple-200 pt-3">
                    The difficulty of the levels is determined by bot performance. 
                    By definition, bot 4 succeeds on medium levels and fails on hard levels.
                    Watch medium levels to see where bot 4 outperforms the other bots.
                    Watch hard levels to see where bot 4 (and the other bots) fall short.
                    If you only look at hard levels, it might give you a bad impression of bot 4,
                    but in testing it succeeds more often than the other bots. It is impossible
                    to make a bot that always succeeds.
                </p>
                <div className="flex flex-col items-center pt-3"><button onClick={()=>props.setShowAbout(false)} className="text-white hover:underline content-center">Close</button></div>
            </div>
        </div>
    )
}