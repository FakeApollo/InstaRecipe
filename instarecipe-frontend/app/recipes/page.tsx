'use client';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import RecipeCard from '../../components/RecipeCard';
import Loading from '../../components/Loading';

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
            imageUrl: data.imageUrl || '/images/recipes/default.webp'
          };
        });

        const filteredRecipes = selected.length > 0 
          ? allRecipes.filter(recipe => selected.every(ingredient => recipe.ingredients.includes(ingredient)))
          : allRecipes;

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
  return <Loading />;
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
            <div className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center font-bold text-lg">
              IR
            </div>
            <span>← Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Insta Recipe</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Selected Ingredients Display */}
        {selectedIngredients.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Recipes with:</h2>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {ingredientDetails[ingredient] || ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Cards Grid */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {selectedIngredients.length > 0 ? 'Matching Recipes' : 'All Recipes'} ({recipes.length})
        </h2>
        
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">
              Back to Ingredients
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}