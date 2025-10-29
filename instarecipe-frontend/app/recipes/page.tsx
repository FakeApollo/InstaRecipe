'use client';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import RecipeCard from '../../components/RecipeCard';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  category: string;
  imageUrl: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientDetails, setIngredientDetails] = useState<{[key: string]: string}>({});

  const getIngredientDetails = async (ingredientIds: string[]) => {
    const details: {[key: string]: string} = {};
    
    for (const id of ingredientIds) {
      try {
        const ingredientDocRef = doc(db, 'foodItems', id);
        const ingredientDocSnap = await getDoc(ingredientDocRef);
        if (ingredientDocSnap.exists()) {
          details[id] = ingredientDocSnap.data().name;
        }
      } catch (error) {
        console.error(`Error fetching ingredient ${id}:`, error);
      }
    }
    
    return details;
  };

  useEffect(() => {
    // Get selected ingredients from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selected = urlParams.getAll('selected');
    setSelectedIngredients(selected);

    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const allRecipes = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            instructions: Array.isArray(data.instructions) ? data.instructions : [],
            cookingTime: data.cookingTime || 0,
            category: data.category || '',
            imageUrl: data.imageUrl || 'https://via.placeholder.com/300x200'
          };
        });

        // Filter recipes that contain all selected ingredients
        const filteredRecipes = allRecipes.filter(recipe => {
          return selected.every(ingredient => recipe.ingredients.includes(ingredient));
        });

        // Get ingredient names for all recipes
        const allIngredientIds = filteredRecipes.flatMap(recipe => recipe.ingredients);
        const uniqueIngredientIds = [...new Set(allIngredientIds)];
        const ingredientDetails = await getIngredientDetails(uniqueIngredientIds);

        setRecipes(filteredRecipes);
        setIngredientDetails(ingredientDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading recipes...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-200 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
              Logo
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Insta Recipe</h1>
          <div className="w-12 h-12"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Selected Ingredients Display */}
        {selectedIngredients.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Recipes with ingredients:</h2>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Cards Grid */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Matching Recipes ({recipes.length})</h2>
        
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                name={recipe.name}
                cookingTime={recipe.cookingTime}
                imageUrl={recipe.imageUrl}
                ingredients={recipe.ingredients}
                ingredientNames={ingredientDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No recipes found with your selected ingredients.</p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              Back to Ingredients
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}