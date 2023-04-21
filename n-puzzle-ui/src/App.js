import React from 'react';
import './App.css';
import PuzzleBoard from './puzzle/Broad';

function App() {
  // console.log(window)
  const githubRepo = "https://github.com/aallali/N-Puzzle-Js"
  return (
    <div className="App-container">
      <PuzzleBoard />
      <p>Github repo if you want to contribute : <a target="_blank" href={githubRepo} rel="noreferrer">{githubRepo}</a></p>
    </div>
  );
}

export default App;
