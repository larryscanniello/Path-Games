import { Link } from "react-router-dom"

export default function Credits(){
    return <div className="m-24"><div className="pl-48">
        <p>
            Path Games started off as a project in my artificial intelligence class at Rutgers.
        </p>
        <p className="mb-3">
            The main game mechanics and ideas, including the stories, came from that class.
        </p>
        <p>Ship tiles: <Link className="text-white hover:underline mb-3" to="https://opengameart.org/content/space-tiles-128x128">Hyptosis</Link></p>
        <p>Fire sprites: <Link className="text-white hover:underline mb-3" to="https://opengameart.org/content/pixel-fire">DanelsAlive</Link></p>
        <p>Mouse sprites: <Link className="text-white hover:underline mb-3" to="https://opengameart.org/content/rodents-rat-rework">AntumDeluge</Link></p>
        <p></p>
    </div>
    </div>
}