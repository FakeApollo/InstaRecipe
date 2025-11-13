'use client';
import React from 'react';
import Image from 'next/image';

interface IngredientCardProps {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  name,
  imageUrl,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center justify-start gap-3
        w-44 sm:w-48 h-16 sm:h-18 px-4 py-2
        font-bold text-left rounded-md
        border-4 
        transition-transform duration-150
        active:scale-95
        ${
          isSelected
            ? 'bg-green-700 border-green-500 text-white shadow-[4px_4px_0_#000]'
            : 'bg-gray-800 border-gray-400 text-white shadow-[4px_4px_0_#000]'
        }
        hover:-translate-x-1 hover:-translate-y-1
        hover:shadow-[6px_6px_0_#000]
      `}
    >
      {/* Ingredient Image */}
      <div className="w-10 h-10 relative shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain rounded-sm"
        />
      </div>

      {/* Ingredient Name */}
      <span className="text-sm sm:text-base leading-tight">{name}</span>

      {/* Top‑left check when selected */}
      {isSelected && (
        <div className="absolute -top-2 -left-2 bg-green-500 border-2 border-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
};

export default IngredientCard;