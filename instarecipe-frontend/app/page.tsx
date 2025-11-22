"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "../components/Hero";
import IngredientCard from "../components/IngredientCard";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "foodItems"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoodItems(items);
      } catch (error) {
        console.error("Error fetching food items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const generateRecipes = () => {
    const queryParams = new URLSearchParams();
    selectedItems.forEach((item) => queryParams.append("selected", item));
    router.push(`/recipes?${queryParams.toString()}`);
  };

  const scrollToIngredients = () => {
    document.getElementById("ingredients-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const filteredItems = foodItems.filter(
    (item) =>
      String(item.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedItems: Record<string, any[]> = {};
  filteredItems.forEach((item) => {
    if (!categorizedItems[item.category]) categorizedItems[item.category] = [];
    categorizedItems[item.category].push(item);
  });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <Hero onScrollToIngredients={scrollToIngredients} />

      {/* Ingredients Section */}
      <section
        id="ingredients-section"
        className="min-h-screen py-20 px-2 sm:px-4 md:px-6 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/dark-bg.jpg')",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-semibold text-center mb-12 text-white">
            Ingredients
          </h2>

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {/* Categories */}
          {Object.entries(categorizedItems).map(([category, items]) => (
            <div key={category} className="mb-16">
              <h3 className="text-2xl font-medium text-center mb-8 text-white capitalize border-b border-white/30 pb-2">
                {category}
              </h3>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                  xl:grid-cols-6
                  justify-items-center
                  gap-4 sm:gap-6 md:gap-8
                  w-full
                "
              >
                {items.map((item) => (
                  <IngredientCard
                    key={item.id}
                    name={item.name}
                    imageUrl={
                      item.imageUrl || "/images/ingredients/default.webp"
                    }
                    isSelected={selectedItems.includes(item.id)}
                    onClick={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Generate Button */}
          <div className="text-center mt-16">
            <button
              onClick={generateRecipes}
              disabled={selectedItems.length === 0}
              className={`px-12 py-4 rounded-full text-lg font-semibold transition-all ${
                selectedItems.length === 0
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-lg"
              }`}
            >
              {selectedItems.length === 0
                ? "SELECT INGREDIENTS"
                : `LET'S MAKE (${selectedItems.length})`}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
