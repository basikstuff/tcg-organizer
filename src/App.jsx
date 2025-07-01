import React, { useState } from 'react';
import GameSelector from './components/GameSelector';
import Sidebar from './components/Sidebar';
import DecksPage from './components/DecksPage';

export default function App() {
  const [selectedGame, setSelectedGame] = useState('mtg');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <GameSelector selectedGame={selectedGame} setSelectedGame={setSelectedGame} />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '2rem' }}>
          <DecksPage selectedGame={selectedGame} />
        </div>
      </div>
    </div>
  );
}
