import React from 'react';
import './App.css';
import PuzzleBoard from './puzzle/Broad';

function App() {

  return (
    <div className="App-container">
      <PuzzleBoard worker={null} />
    </div>
  );
}

export default App;
