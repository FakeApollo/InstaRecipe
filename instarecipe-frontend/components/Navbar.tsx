'use client';

const Navbar = () => {
  return (
    <nav className="absolute top-8 right-8 z-20">
      <ul className="flex gap-6 text-sm text-white">
        <li className="hover:text-green-300 cursor-pointer transition-colors font-medium">Home</li>
        <li className="hover:text-green-300 cursor-pointer transition-colors font-medium">Recipes</li>
        <li className="hover:text-green-300 cursor-pointer transition-colors font-medium">About</li>
        <li className="hover:text-green-300 cursor-pointer transition-colors font-medium">More</li>
        <li className="hover:text-green-300 cursor-pointer transition-colors font-medium">Bhat Bhaji</li>
      </ul>
    </nav>
  );
};

export default Navbar;