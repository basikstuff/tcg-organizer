import React from 'react';

export default function Sidebar() {
  return (
    <div style={{ width: '250px', background: '#1e1e1e', color: 'white', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ color: '#ffcc00' }}>⚡ TCG Nav</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="#" style={{ color: 'white' }}>Dashboard</a></li>
          <li><a href="#" style={{ color: 'white' }}>Decks</a></li>
          <li><a href="#" style={{ color: 'white' }}>Collections</a></li>
          <li><a href="#" style={{ color: 'white' }}>Settings</a></li>
        </ul>
      </nav>
    </div>
  );
}
