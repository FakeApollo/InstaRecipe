"use client";
import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import Loading from "../../../components/Loading";
import Image from "next/image";

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
  const [ingredientDetails, setIngredientDetails] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (typeof id === "string") {
          const docRef = doc(db, "recipes", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const recipeData = {
              id: docSnap.id,
              name: data.name || "",
              ingredients: Array.isArray(data.ingredients)
                ? data.ingredients
                : [],
              instructions: Array.isArray(data.instructions)
                ? data.instructions
                : [],
              cookingTime: data.cookingTime || 0,
              category: data.category || "",
              imageUrl: data.imageUrl || "https://via.placeholder.com/300x200",
            };
            setRecipe(recipeData);

            // Fetch ingredient names
            const ingredientNames: { [key: string]: string } = {};
            for (const ingredientId of recipeData.ingredients) {
              const ingredientDocRef = doc(db, "foodItems", ingredientId);
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
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Recipe not found.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-800 text-white pb-10" // p-6 সরালাম, যাতে ইমেজ বর্ডারে লেগে থাকে
      style={{
        backgroundImage: `url('/dark-bg.jpga')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ১. হিরো ইমেজ (এখন এটি কন্টেইনারের বাইরে, তাই পুরো ওয়াইড এবং বাম থেকে শুরু হবে) */}
      <div className="relative w-full h-[500px] mb-8">
        <Image
          src={recipe.imageUrl}
          alt={recipe.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* গ্রেডিয়েন্ট শেড */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 via-40% to-gray-800"></div>

        {/* শুধু বড় টাইটেল */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-10 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-xl">
            {recipe.name}
          </h1>
        </div>
      </div>
      <div className="flex justify-center gap-6 mb-10 text-lg font-medium text-gray-300">
        <span className="px-4 py-2 bg-gray-900 rounded-full border border-gray-700">
          ⏱️ {recipe.cookingTime} mins
        </span>
        <span className="px-4 py-2 bg-gray-900 rounded-full border border-gray-700 uppercase tracking-wide">
          {recipe.category}
        </span>
      </div>
      {/* ২. বাকি সব কন্টেন্ট (টাইটেল, টেক্সট) মাঝখানে থাকবে */}
      <div className="max-w-5xl mx-auto px-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Small Image + Instructions */}
          <div className="lg:col-span-2">
            {/* ছোট থাম্বনেইল ইমেজ */}
            <div className="mb-8">
              <Image
                src={recipe.imageUrl}
                alt="Recipe Thumbnail"
                width={400}
                height={300}
                className="rounded-xl object-cover shadow-lg"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                How to Make
              </h2>
              <ol className="space-y-4 text-lg leading-relaxed">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Column - Ingredients */}
          <div className="bg-gray-900 p-6 rounded-lg h-fit sticky top-4">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredientId, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {ingredientDetails[ingredientId] || ingredientId}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Final Note */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg text-center">
          <p className="italic">
            গরম গরম পরিবেশন করুন — পছন্দ হলে চাট মসলা ছিটিয়ে। 😋
          </p>
        </div>
      </div>
    </div>
  );
}
