"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface RecipeCardProps {
  id: string;
  name: string;
  cookingTime: number;
  imageUrl: string;
  ingredients: string[];
  ingredientNames: { [key: string]: string };
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  name,
  cookingTime,
  imageUrl,
  ingredients,
  ingredientNames,
}) => {
  return (
    <Link href={`/recipes/${id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="h-48 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-600">⏱️ {cookingTime} mins</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {ingredients.slice(0, 3).map((ingredientId, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {ingredientNames[ingredientId] || ingredientId}
              </span>
            ))}
            {ingredients.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                +{ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
