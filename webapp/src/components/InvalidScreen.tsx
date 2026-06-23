import React, { useEffect } from "react";
import "./InvalidScreen.css";

function InvalidScreen() {
    console.log("Rendering InvalidScreen");

    useEffect(() => {
        return () => {
            console.log("Unmounting InvalidScreen");
        }
    }, []);

    return (
        <div className="InvalidScreen">
            <h1>Invalid Screen</h1>
        </div >
    );
}

export default InvalidScreen;