'use client';
import React from 'react';
import Image from 'next/image';

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
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-4xl transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'scale-105 bg-blue-50 border-2 border-blue-500' 
          : 'scale-100 bg-white hover:bg-gray-50 border-2 border-transparent'
      }`}
    >
      <div className="w-15 h-15 rounded-lg overflow-hidden mb-2 relative">
        <Image 
          src={imageUrl} 
          alt={name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <span className="text-xs font-medium text-center text-gray-800">{name}</span>
    </button>
  );
};

export default IngredientCard;