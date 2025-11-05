"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {Card, CardHeader, CardBody} from "@heroui/react";

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
  ingredients,
  ingredientNames,
}) => {
  // Get first 3-4 ingredient names
  const displayIngredients = ingredients
    .slice(0, 4)
    .map(ingredientId => ingredientNames[ingredientId] || ingredientId)
    .join(", ");

  return (
    <Link href={`/recipes/${id}`} className="block group">
      <Card className="py-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <CardBody className="overflow-visible py-2">
          <Image
            alt={name}
            className="object-cover rounded-xl w-full h-48 group-hover:scale-105 transition-transform duration-300"
            src={imageUrl}
            width={270}
            height={192}
          />
        </CardBody>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          {/* Name first - where "Frontend Radio" was */}
          <h4 className="font-bold text-large text-gray-800 group-hover:text-green-600 transition-colors mb-1">
            {name}
          </h4>
          {/* Ingredients below - where "12 Tracks" was */}
          <small className="text-default-500 line-clamp-2 text-black font-light">
            {displayIngredients}{ingredients.length > 4 ? "..." : ""}
          </small>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default RecipeCard;