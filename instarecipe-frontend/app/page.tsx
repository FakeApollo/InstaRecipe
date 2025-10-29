'use client';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import IngredientCard from '../components/IngredientCard';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchingRecipes, setMatchingRecipes] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  // Load food items from Firestore
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'foodItems'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFoodItems(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food items:', error);
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const generateRecipes = async () => {
    if (selectedItems.length === 0) return;
    
    // Create URL with selected ingredients as query parameters
    const queryParams = new URLSearchParams();
    selectedItems.forEach(item => queryParams.append('selected', item));
    
    // Navigate to recipes page with selected ingredients
    router.push(`/recipes?${queryParams.toString()}`);
  };

  // Filter food items based on search term
  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group items by category
  const categorizedItems: Record<string, any[]> = {};
  filteredItems.forEach(item => {
    if (!categorizedItems[item.category]) {
      categorizedItems[item.category] = [];
    }
    categorizedItems[item.category].push(item);
  });

  if (loading) {
    return <div className="text-center py-10">Loading ingredients...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-200 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
            Logo
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Insta Recipe</h1>
          <div className="w-12 h-12"></div> {/* Empty space for balance */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center bg-gray-200 rounded-full px-3 py-2">
            <input
              type="text"
              placeholder="Search Food Items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-transparent outline-none px-2"
            />
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Selected Items Label */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-600">Select food items</h2>
        </div>

        {/* Categorized Food Items */}
        {Object.entries(categorizedItems).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">{category}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {items.map((item) => (
                <IngredientCard
                  key={item.id}
                  name={item.name}
                  category={item.category}
                  imageUrl={item.imageUrl || '/images/ingredients/default.jpg'}
                  isSelected={selectedItems.includes(item.id)}
                  onClick={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Generate Button */}
        <div className="text-center mt-6">
          <button
            onClick={generateRecipes}
            disabled={selectedItems.length === 0}
            className={`px-6 py-3 rounded-full font-semibold ${
              selectedItems.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Let's Make!
          </button>
        </div>
      </main>
    </div>
  );
}