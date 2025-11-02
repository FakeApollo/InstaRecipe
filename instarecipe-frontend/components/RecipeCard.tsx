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
  imageUrl,
}) => {
  return (
    <Link href={`/recipes/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        {/* Image Section */}
        <div className="h-48 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Name Section - Simple text below image */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;