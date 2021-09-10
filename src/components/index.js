import React from "react";
import { useWindowSize } from "../helpers";
import NFLWP from "../assets/images/nfl.jpg"

export default function MyApp() {
    const [width, height] = useWindowSize()
    return (
        <div className="min-h-screen bg-red-100">
            <div>
                <img src={NFLWP} alt="" className="h-20 lg:h-100" />
            </div>
        </div>
    )
}