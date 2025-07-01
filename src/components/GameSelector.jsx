import React from 'react';

export default function GameSelector({ selectedGame, setSelectedGame }) {
  const games = ['mtg', 'pokemon', 'lorcana'];

  return (
    <div style={{ backgroundColor: '#2c2c2c', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
      <h3 style={{ margin: 0 }}>TCG Organizer</h3>
      <select
        value={selectedGame}
        onChange={(e) => setSelectedGame(e.target.value)}
        style={{ backgroundColor: '#1e1e1e', color: 'white', border: '1px solid #555', padding: '0.3rem 0.5rem', borderRadius: '4px' }}
      >
        {games.map(game => (
          <option key={game} value={game}>{game.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
}
