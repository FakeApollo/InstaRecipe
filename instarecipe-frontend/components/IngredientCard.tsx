"use client";
import React from "react";
import Image from "next/image";

interface IngredientCardProps {
  name: string;
  category: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  name,
  category,
  imageUrl,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ${
        isSelected
          ? "bg-blue-100 ring-2 ring-blue-300"
          : "bg-white hover:bg-gray-100"
      }`}
      style={{ borderRadius: "15px" }}
    >
      <div className="w-16 h-16 rounded-none overflow-hidden mb-2 relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <span className="text-sm font-medium text-center">{name}</span>
    </button>
  );
};

export default IngredientCard;
