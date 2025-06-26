import { useEffect, useState } from 'react';

export default function ScryfallTest() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('https://api.scryfall.com/cards/search?q=+type:creature&unique=cards')
      .then(res => res.json())
      .then(data => setCards(data.data.slice(0, 5)));
  }, []);

  return (
    <div>
      <h2>Sample Creature Cards</h2>
      <ul>
        {cards.map(card => (
          <li key={card.id}>
            {cards.map(card => (
  <li key={card.id}>
    {card.image_uris?.small ? (
      <img src={card.image_uris.small} alt={card.name} />
    ) : (
      <p>No image available</p>
    )}
    <p>{card.name}</p>
  </li>
))}

            <p>{card.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
