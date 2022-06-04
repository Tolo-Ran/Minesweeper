import React, {useState} from "react";
import './board.styles.css';
import Banner from "./banner/banner.component.jsx";
import Control from "./control-panel/control-panel.component.jsx";
import Field from "./field/field.component.jsx";
import {FlagsContext} from "../../contexts/flagsContext.js";
import {GameOverContext} from "../../contexts/gameOverContext.js";
import {StartGameContext} from "../../contexts/startGameContext.js";
import {ExplodedCellContext} from "../../contexts/explodedCellContext.js";

function Board() {
    const [flags, setFlags] = useState(10);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [indexExplodedCell, setIndexExplodedCell] = useState(null);
    return (
        <div className="board-container">
            <Banner/>
            <FlagsContext.Provider value={{flags, setFlags}}>
                <GameOverContext.Provider value={{isGameOver, setIsGameOver}}>
                    <StartGameContext.Provider value={{isGameStarted, setIsGameStarted}}>
                        <ExplodedCellContext.Provider value={{indexExplodedCell, setIndexExplodedCell}}>
                            <Control/>
                            <Field/>
                        </ExplodedCellContext.Provider>
                    </StartGameContext.Provider>
                </GameOverContext.Provider>
            </FlagsContext.Provider>

        </div>
    );
}
export default Board;