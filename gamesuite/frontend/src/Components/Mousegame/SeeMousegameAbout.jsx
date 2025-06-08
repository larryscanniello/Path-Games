

export default function SeeMousegameAbout(props) {
    return (
        <div className="fixed z-20 bg-gray-800/90 max-h-[100vh] overflow-y-auto ml-24 mr-24 text-sm rounded-md">
            <div className="pt-12 pr-8 pl-8 pb-12 text-indigo-100">
                <p className="pb-4">The key feature of the bots is that they each maintain their own belief array.
                    For a given bot, each number in its array at a point in time represents the probability of the mouse
                    being in a space, given the evidence collected so far. There are two types of evidence:
                    the bot senses and gets a beep or not, or the bot steps into a space and doesn't find a mouse there.
                    The bots use a filtering algorithm to update their belief array when new evidence comes in.
                    </p>
                <p className="pb-4">
                    Bot 1 senses once, then goes to the highest probability space, then repeats.
                    </p> 
                <p className="pb-4">
                    Bot 2 alternates sensing and moving, and at each step replans its path to the new highest probability space.
                    </p> 
                <p className="pb-4">
                    My goal was to make a better bot than bot 1 and bot 2. 
                    My first attempt was bot 3.
                    Bot 3 alternates sensing and moving, and plans 5 steps at a time and sticks with the plan.
                    Where the other bots use a simpler breadth-first-search to find their paths,
                    bot 3 uses a uniform cost search to find a path that maximizes the probability 
                    that the mouse will be on it. When the mouse is stochastic, it uses a prediction algorithm
                    to predict where the mouse will be in the future.
                </p>
                <p className="pb-4">
                    Bot 4 was my second attempt. Bot 4 seeks to maximize information gain.
                    It asks, where would getting a negative sense give me the most information?
                    And then it goes there, and senses five times, and repeats. It uses the same
                    probability maximizing search as bot 3.
                </p>
                <p className="pb-4">
                    Both bots 3 and 4 have a second mode. Once there is a 7x7 grid
                    where the sum of probabilities in that grid is over .5, the bots shift gears.
                    If the mouse is stationary, the bots revert to the bot 1 strategy.
                    If the mouse is stochastic, the bots revert to the bot 3 strategy.
                </p>
                <p className="pb-4">
                    Bots 3 and 4 perform about the same on average, and they perform significantly better on average
                    than bots 1 and 2.
                </p>
                <div className="flex flex-col items-center"><button onClick={()=>props.setShowAbout(false)} className="text-white hover:underline content-center pb-8">Close</button></div>

            </div>
        </div>
    );
}