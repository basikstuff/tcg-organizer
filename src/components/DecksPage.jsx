import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function DecksPage({ selectedGame }) {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    async function fetchDecks() {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('game', selectedGame);

      if (error) console.error(error);
      else setDecks(data);
    }
    fetchDecks();
  }, [selectedGame]);

  return (
    <div>
      <h2>{selectedGame.toUpperCase()} Decks</h2>
      <ul>
        {decks.map(deck => (
          <li key={deck.id}>{deck.name}</li>
        ))}
      </ul>
    </div>
  );
}
