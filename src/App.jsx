import { useState } from 'react';
import Sidebar from './components/Sidebar';
import GameSelector from './components/GameSelector';

export default function App() {
  const [selectedGame, setSelectedGame] = useState('mtg');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <GameSelector selectedGame={selectedGame} setSelectedGame={setSelectedGame} />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '2rem' }}>
          <h1>🎴 Welcome to TCG Organizer</h1>
          <p>Currently viewing: <strong>{selectedGame.toUpperCase()}</strong></p>
          <p>Start exploring your cards and building decks!</p>
        </div>
      </div>
    </div>
  );
}
