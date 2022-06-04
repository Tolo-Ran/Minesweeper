import React, {useContext, useEffect, useState} from "react";
import "./field.styles.css";
import {v4 as uuidv4} from 'uuid';
import {StartGameContext} from "../../../contexts/startGameContext"
import {GameOverContext} from "../../../contexts/gameOverContext";
import {FlagsContext} from "../../../contexts/flagsContext";
const Field = () => {
    const NUMBER_OF_ROWS = 9;
    const NUMBER_OF_COLUMNS = 8;
    const [initialField, setInitialField] = useState([]);
    const [currentField, setCurrentField] = useState([]);
    const [accessKey, setAccessKey] = useState("");
    const [tileEventType, setTileEventType] = useState();

    const {isGameStarted, setIsGameStarted} = useContext(StartGameContext);
    const {isGameOver, setIsGameOver} = useContext(GameOverContext);
    const {flags, setFlags} = useContext(FlagsContext);


    useEffect(() => {
        let init = createInitialField(NUMBER_OF_ROWS, NUMBER_OF_COLUMNS);
        setInitialField(init);
    }, [])

    useEffect(() => {
        setCurrentField(initialField);
    }, [initialField]);

    useEffect(() => {
        switch (tileEventType) {
            case 'click':
                let tileLeftClicked = getClickedTile(currentField, accessKey);
                revealTile(currentField, tileLeftClicked);

                break;
            case 'contextmenu':
                let tileRightClicked = getClickedTile(currentField, accessKey);
                toggleMarkedTile(currentField, tileRightClicked, accessKey);
                break;
        }
    }, [accessKey, isGameOver]);

    const createInitialField = (numberOfRows, numberOfColumns) => {
        const field = [];
        for (let x = 0; x < numberOfRows; x++) {
            const row = [];
            for (let y = 0; y < numberOfColumns; y++) {
                const key = uuidv4();
                const tile = {
                    x,
                    y,
                    id: key,
                    isOpen: false,
                    isMarked: false,
                    isExploded: false,
                    numberOfSurroundingMines: 11,
                    isMine: Math.random() < 0.1
                }
                createNewOrOverwriteBtn(tile, key, handleClick);
                row.push(tile);
            }
            field.push(row);
        }
        return field;
    };

    let launchGame = () => {
        if (!isGameStarted) {
            setIsGameStarted(true);
        }
    }

    let handleClick = (e) => {
        setTileEventType(e.type);
        switch (e.type) {
            case 'click':
                launchGame();
                setAccessKey(e.target.accessKey);
                break;
            case 'contextmenu':
                e.preventDefault();
                launchGame();
                setAccessKey(e.target.accessKey);
                break;
            default:
                console.log(tileEventType + "Not a click");
        }
    }

    let createNewOrOverwriteBtn = (tile, accessKey, handleClick) => {
        let innerTextBtn = !tile.isMine && tile.isOpen && (tile.numberOfMines > 0) ? tile.numberOfMines
                    : !tile.isMine && tile.isOpen && (tile.numberOfMines === 0) ? "" : "";

        tile.btn = <button
            disabled={tile.isOpen}
            onClick={handleClick}
            onContextMenu={handleClick}
            accessKey={accessKey}
            key={accessKey}
            className={tile.isExploded?"cell exploded" : tile.isMarked ? "cell target" : tile.isOpen && tile.isMine ?
                "cell fired" : "cell"}>{innerTextBtn}</button>;
    };

    let getClickedTile = (currentField, accessKey) => {
        for (let i = 0; i < currentField.length; i++) {
            for (let j = 0; j < currentField[i].length; j++) {
                if (currentField[i][j].id === accessKey) {
                    return currentField[i][j];
                }
            }
        }
    }

    let toggleMarkedTile = (field, tile, accessKey) => {
        if (tile.id === accessKey && !tile.isOpen) {
            if (tile.isMarked) {
                tile.isMarked = false;
                let current = 0;
                current += flags;
                current++;
                setFlags(current);
                createNewOrOverwriteBtn(tile, accessKey, handleClick);
                setCurrentField([...field]);

            } else if (!tile.isMarked && flags > 0) {
                let current = 0;
                current += flags;
                current--;
                setFlags(current);
                tile.isMarked = true;
                createNewOrOverwriteBtn(tile, accessKey, handleClick);
                setCurrentField([...field]);
            }
        }
    }

    let checkGameOver = (field, tile, accessKey) => {
        if (tile.isMine) {
            setIsGameOver(true);
            tile.isExploded = true;
            for (let i = 0; i < field.length; i++) {
                for (let j = 0; j < field[i].length; j++) {
                    field[i][j].isOpen = true;
                    field[i][j].isMarked = false;
                    field[i][j].numberOfMines = countMinesAroundATile(field, field[i][j]);
                    createNewOrOverwriteBtn(field[i][j], accessKey, handleClick);
                }
            }
        }
        setCurrentField([...field]);
    }


    let revealTile = (field, tile, accessKey) => {
        if(!tile.isOpen && !tile.isMarked) {
            checkGameOver(field, tile, accessKey);
            tile.isOpen = true;
            tile.numberOfMines = countMinesAroundATile(field, tile);
            createNewOrOverwriteBtn(tile, accessKey, handleClick);
            if (tile.numberOfMines === 0) {
                // flood file
                floodFill(field, tile);
            }
            setCurrentField([...field]);
        }
    }

    let floodFill = (field, tile) => {
        let neighbors = getNearbyTiles(field, tile);
        neighbors.map(neighbor => revealTile(field, neighbor, neighbor.id));
    };

    let countMinesAroundATile = (field, tile) => {
        let neighbors = getNearbyTiles(field, tile);
        let count = 0;
        neighbors.forEach(neighbor => {
                if (neighbor.isMine) {
                    count++;
                }
        });
        return count;
    };

    let getNearbyTiles = (field, tile) => {
        let neighbors = [];
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
            for (let offsetY = -1; offsetY <= 1; offsetY++) {
                if(field[offsetX + tile.x]?.[offsetY + tile.y]){
                    const neighbor = field[offsetX + tile.x]?.[offsetY + tile.y];
                    neighbors.push(neighbor);
                }
            }
        }
        return neighbors;
    }

    return (
        <div className="field">
            {currentField.map(row => row.map(tile => tile.btn))}
        </div>
    );
};
export default Field;