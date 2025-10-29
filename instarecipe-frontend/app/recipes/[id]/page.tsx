'use client';
import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  category: string;
  imageUrl: string;
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredientDetails, setIngredientDetails] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (typeof id === 'string') {
          const docRef = doc(db, 'recipes', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const recipeData = {
              id: docSnap.id,
              name: data.name || '',
              ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
              instructions: Array.isArray(data.instructions) ? data.instructions : [],
              cookingTime: data.cookingTime || 0,
              category: data.category || '',
              imageUrl: data.imageUrl || 'https://via.placeholder.com/300x200'
            };
            setRecipe(recipeData);

            // Fetch ingredient names
            const ingredientNames: {[key: string]: string} = {};
            for (const ingredientId of recipeData.ingredients) {
              const ingredientDocRef = doc(db, 'foodItems', ingredientId);
              const ingredientDocSnap = await getDoc(ingredientDocRef);
              if (ingredientDocSnap.exists()) {
                ingredientNames[ingredientId] = ingredientDocSnap.data().name;
              }
            }
            setIngredientDetails(ingredientNames);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="text-center py-10">Recipe not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-200 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/recipes">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
              Logo
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Insta Recipe</h1>
          <div className="w-12 h-12"></div>
        </div>
      </header>

      {/* Recipe Detail Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64 w-full">
            <Image 
              src={recipe.imageUrl} 
              alt={recipe.name} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe.name}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-4">⏱️ {recipe.cookingTime} mins</span>
              <span className="capitalize">Category: {recipe.category}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredientId, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {ingredientDetails[ingredientId] || ingredientId}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">How to Make</h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/recipes" className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400">
            Back to Recipes
          </Link>
        </div>
      </main>
    </div>
  );
}