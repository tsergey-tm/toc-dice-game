import React from 'react';
import './App.css';
import Game from "./components/Game";
import {GameContextProvider} from "./components/GameContext";

function App() {
    return (
        <div className="App">
            <GameContextProvider>
                <Game/>
            </GameContextProvider>
        </div>
    );
}

export default App;
