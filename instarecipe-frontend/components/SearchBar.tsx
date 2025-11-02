"use client";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search Food Items...",
}) => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="w-full max-w-md flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-2 border border-white/30">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="grow bg-transparent outline-none px-2 text-white placeholder:text-white/70 text-sm"
        />
        {/* Replace this with your own icon */}
        <button className="p-1 text-white hover:text-green-300 hover:cursor-pointer transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
