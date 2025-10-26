"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [matchingRecipes, setMatchingRecipes] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Load food items from Firestore
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "foodItems"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoodItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food items:", error);
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const generateRecipes = async () => {
    if (selectedItems.length === 0) return;

    // Create URL with selected ingredients as query parameters
    const queryParams = new URLSearchParams();
    selectedItems.forEach((item) => queryParams.append("selected", item));

    // Navigate to recipes page with selected ingredients
    window.location.href = `/recipes?${queryParams.toString()}`;
  };

  // Filter food items based on search term
  const filteredItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group items by category
  const categorizedItems: Record<string, any[]> = {};
  filteredItems.forEach((item) => {
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
              className="grow bg-transparent outline-none px-2"
            />
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Selected Items Label */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-600">
            Select food items
          </h2>
        </div>

        {/* Categorized Food Items */}
        {Object.entries(categorizedItems).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedItems.includes(item.id)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Results Section */}
        {showResults && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Matching Recipes ({matchingRecipes.length})
            </h2>
            {matchingRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <h3 className="font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-gray-600">
                      Time: {recipe.cookingTime} mins
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 bg-gray-100 rounded-lg">
                No recipes found with your selected ingredients.
              </p>
            )}
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center mt-6">
          <button
            onClick={generateRecipes}
            disabled={selectedItems.length === 0}
            className={`px-6 py-3 rounded-full font-semibold ${
              selectedItems.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Let's Make!
          </button>
        </div>

        {/* Clear Selection Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setShowResults(false);
              setMatchingRecipes([]);
              setSelectedItems([]);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
          >
            Clear Selection
          </button>
        </div>
      </main>
    </div>
  );
}
