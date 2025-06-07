import NavBar from "../NavBar"
import { Link } from "react-router-dom"
import FiregameDifficultyMenu from "./FiregameDifficultyMenu"

export default function FiregameAbout(props){

    return(
        <div className=" border border-gray-300 bg-gray-800/90 mt-30 ml-4 mr-24 z-10 text-sm rounded-md">
            <div className="pr-8 pl-8 pb-12 text-purple-300 ">
            <p className="pt-12 ">
                    Each map has a fixed fire progression that was traversed by four bots.
                </p>
                <p>
                The difficulty for each map was assigned based on bot performance.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 1 takes a random shortest path to the switch, and sticks with it.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 2 takes a random shortest path, but replans its path if fire enters its path.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 3 takes a random shortest path, but replans if fire enters an adjacent square to
                </p>
                <p>
                one in its path.
                </p>
                <p className="text-purple-300 pt-3">
                    Bot 4 does many simulations of how the fire may turn out, and chooses a path
                </p>
                <p>
                    accordingly.
                </p>
                <p className="text-purple-300 pt-3">
                    If bot 1 succeeds, the map is discarded for being too easy.
                </p>
                <p className="text-purple-300 pt-3">
                    If bot 1 fails and 2 or 3 succeed, the map is easy.
                </p>
                <p className="text-purple-300 pt-3">
                    If bots 1, 2 and 3 fail, and bot 4 succeeds, the map is medium.
                </p>
                <p className="text-purple-300 pt-3">
                    If all of the bots fail but success is still possible, the map is hard.
                </p>
                <div className="flex flex-col items-center">
                <button onClick={()=>props.setShowAbout(false)} className='pt-6 text-white hover:underline'>Close</button>
                </div>
            </div>
        </div>
    )
}