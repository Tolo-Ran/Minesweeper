import React from "react";
import './banner.styles.css';
import bomb from '../bomb.svg';

function Banner() {
    return (
        <div className="banner-container">
            <h2 className="game-header">Minesweeper</h2>
            <img src={bomb} className="game-logo-animation" alt="Bomb as logo"/>
        </div>
    );
}

export default Banner;