import NavBar from "../NavBar"
import { Link } from "react-router-dom"
import FiregameDifficultyMenu from "./FiregameDifficultyMenu"

export default function SeeFiregameInstructions(props) {
    return (
        <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24">
            <div className="pt-12 pr-8 pl-8 pb-12">
                <p className="text-red-200">This is a replay of a game you played, where you can
                    </p>
                <p className="text-red-200 pb-8"> watch what you did and see the bots in action.</p>
                <div className="flex items-center gap-2 mb-2">
                    <div className=" w-3 h-3 rounded-full bg-purple-600 border border-black"></div>
                    <div className="text-white">Player</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className=" w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black">1</div>
                    <div className="text-white">Bot 1 (easy and medium only)</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-600 text-white text-xs flex items-center justify-center border border-black">2</div>
                    <div className="text-white">Bot 2</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center border border-black">3</div>
                    <div className="text-white">Bot 3</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black">4</div>
                    <div className="text-white">Bot 4</div>
                </div>
                <div className="flex items-center gap-2 pb-8">
                    <div className="w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black">5</div>
                    <div className="text-white">Bot 5 (hard only)</div>
                </div>
                <div className="text-white pb-8">See about for bot descriptions.</div>
                <p className="text-red-200 pb-8">Right arrow key: Move simulation forward.</p>
                <p className="text-red-200 pb-8">Left arrow key: Move simulation backward.</p>
                <p className="text-red-200 pb-8">Space bar: Play simulation.</p>
                <div className="flex flex-col items-center">
                    <button onClick={() => props.setShowInstructions(false)} className="text-white hover:underline">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}