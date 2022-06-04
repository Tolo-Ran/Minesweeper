import React, {useContext, useEffect, useState} from "react";
import './control.panel.styles.css';
import bomb from '../bomb.svg';
import happy from './happyicon.svg';
import {FlagsContext} from "../../../contexts/flagsContext.js";
import {GameOverContext} from "../../../contexts/gameOverContext.js";
import {StartGameContext} from "../../../contexts/startGameContext";
import sad from "./sad.png";

function Control() {
    const [timer, setTimer] = useState("00:00");
    const [stopwatchIntervalID, setStopwatchIntervalID] = useState(0);

    const {flags} = useContext(FlagsContext);
    const {isGameOver} = useContext(GameOverContext);
    const {isGameStarted} = useContext(StartGameContext);

    let sec = 0;
    let min = 0;

    let startStopwatch = ()=> {
        sec++;
        let secString;
        let minString;

        if (sec < 10) {
            secString = "0" + sec;
        } else {
            secString = "" + sec;
        }
        if (sec === 60) {
            min++;
            sec = 0;
        }
        if (min < 10) {
            minString = "0" + min;
        } else {
            minString = "" + min;
        }
        setTimer(minString + ":" + secString);
    }

    useEffect(() => {
        if (isGameStarted) {
            let currentInterval = setInterval(startStopwatch, 1000);
            setStopwatchIntervalID(currentInterval);
        }
    }, [isGameStarted]);

    useEffect(() => {
        if (isGameOver) {
            clearInterval(stopwatchIntervalID);
        }
    }, [isGameOver]);


    return (
        < div className="control-panel">
            <div><img className="bomb-icon-control-panel" src={bomb} alt="Bomb icon"/>
                <label> {flags}</label>
            </div>
            <button className="happy-button">{
                isGameOver ? <img className="sad-icon" src={sad} alt="sad smiley icon"/> : <img className="happy-icon" src={happy} alt="Happy smiley icon"/>
            }</button>
            <label>{timer}</label>
        </div>
    );
}

export default Control;