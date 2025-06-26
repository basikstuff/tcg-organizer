import './App.css';

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">TCG Organizer</div>
        <nav>
          <ul>
            <li><a href="#">Browse</a></li>
            <li><a href="#">Decks</a></li>
            <li><a href="#">Collections</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Welcome to TCG Organizer</h1>
        <p>Start exploring your cards and building decks!</p>
      </main>
    </div>
  );
}
