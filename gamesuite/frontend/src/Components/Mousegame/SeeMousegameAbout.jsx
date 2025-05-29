

export default function SeeMousegameAbout(props) {
    return (
        <div className="fixed z-20 border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24">
            <div className="pt-12 pr-8 pl-8 pb-12">
                <p>The key feature of my bots is that they maintain an array of probabilities,
                    where each entry in the array represents the probability of the mouse
                    being in the space, given the evidence collected so far. There is two types of evidence:
                    the bot senses and gets a beep or not, or the bot steps into a space and doesn't find a mouse there.
                    The bots use a filtering algorithm to update their belief array when new evidence comes in.
                    </p>  

            </div>
        </div>
    );
}