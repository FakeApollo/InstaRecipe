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
        flex flex-col items-center w-[150px] p-4 box-border
        rounded-xl transition-transform duration-150 
        active:scale-95
        ${isSelected ? 'bg-transparent' : 'bg-transparent'}
      `}
    >
      {/* circular wrapper */}
      <div
        className={`
          relative w-24 h-24 rounded-full overflow-hidden
          flex justify-center items-center
          bg-[#333d40] shadow-[0_0_0_2px_#505c60]
          ${isSelected ? 'ring-3 ring-cyan-300 ring-offset-2 ring-offset-black' : ''}
        `}
      >
        <Image
          src={imageUrl || '/images/ingredients/default.webp'}
          alt={name}
          height={60}
          width={60}
          className="object-cover"
          sizes="96px"
        />
      </div>

      <p className="text-white text-base font-semibold mt-4 tracking-wide text-center">
        {name}
      </p>
    </button>
  );
};

export default IngredientCard;