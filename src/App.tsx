
import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Card {
  name: string;
  setCode: string;
  quantity: number;
  foil: string;
  scryfallId: string;
  collectorNumber: string;
  marketPrice?: number;
  imageUrl?: string;
  error?: string;
}

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<any>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadUserCollection(data.user.id);
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserCollection(session.user.id);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserCollection = async (userId: string) => {
    const { data } = await supabase.from("collections").select("data").eq("user_id", userId).single();
    if (data?.data) {
      setCards(data.data);
    }
  };

  const saveUserCollection = async () => {
    if (!user) return;
    await supabase.from("collections").upsert({
      user_id: user.id,
      data: cards
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsed = results.data.map((row: any) => ({
          name: row["Name"],
          setCode: row["Set code"],
          quantity: parseInt(row["Quantity"] || "0", 10),
          foil: row["Foil"],
          scryfallId: row["Scryfall ID"],
          collectorNumber: row["Collector number"],
        }));
        setCards(parsed);
        setCurrentPage(1);
        saveUserCollection();
      },
    });
  };

  const fetchMarketPrices = async () => {
    setLoadingPrices(true);
    const updatedCards = await Promise.all(
      cards.map(async (card) => {
        if (!card.scryfallId) return { ...card, marketPrice: null, error: "Missing Scryfall ID" };
        try {
          const res = await fetch(`https://api.scryfall.com/cards/${card.scryfallId}`);
          const data = await res.json();
          const imageUrl = data.image_uris?.normal || null;
          const tcgplayerId = data.tcgplayer_id;
          const realPrice = parseFloat(data?.prices?.usd) || null;
          if (!tcgplayerId) return { ...card, marketPrice: null, imageUrl, error: "No TCGPlayer ID" };
          return { ...card, marketPrice: realPrice, imageUrl, error: undefined };
        } catch (err) {
          return { ...card, marketPrice: null, error: "Failed to fetch" };
        }
      })
    );
    setCards(updatedCards);
    setLoadingPrices(false);
    saveUserCollection();
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  const totalValue = filteredCards.reduce((sum, card) => sum + (card.marketPrice || 0) * card.quantity, 0);
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const currentCards = filteredCards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">MTG Collection Viewer</h1>

      {!user ? (
        <AuthForm />
      ) : (
        <>
          <p className="mb-2">Logged in as: {user.email}</p>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full sm:w-1/3"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={fetchMarketPrices}
              disabled={loadingPrices}
            >
              {loadingPrices ? "Loading Prices..." : "Fetch Market Prices"}
            </button>
          </div>

          <table className="table-auto w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Card Name</th>
                <th className="p-2 border">Set</th>
                <th className="p-2 border">Foil</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Market Price</th>
                <th className="p-2 border">Error</th>
              </tr>
            </thead>
            <tbody>
              {currentCards.map((card, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <td className="border p-2">
                    {card.imageUrl ? <img src={card.imageUrl} alt={card.name} className="w-16 h-auto" /> : "-"}
                  </td>
                  <td className="border p-2">{card.name}</td>
                  <td className="border p-2">{card.setCode}</td>
                  <td className="border p-2">{card.foil}</td>
                  <td className="border p-2">{card.quantity}</td>
                  <td className="border p-2">
                    {card.marketPrice !== undefined ? `$${card.marketPrice.toFixed(2)}` : "-"}
                  </td>
                  <td className="border p-2 text-red-500">{card.error || ""}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-bold">
                <td className="p-2 border" colSpan={5}>Total Value</td>
                <td className="p-2 border" colSpan={2}>${totalValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded border ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-2">{isLogin ? "Login" : "Sign Up"}</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded mb-2">
        {isLogin ? "Login" : "Create Account"}
      </button>
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-blue-600 underline text-sm"
      >
        {isLogin ? "Need to create an account?" : "Already have an account? Login"}
      </button>
    </form>
  );
}
