'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";

const Header = () => {
  return (
    <Navbar 
      shouldHideOnScroll 
      className="bg-transparent text-white"
      classNames={{
        wrapper: "px-4 max-w-full",
      }}
      height="60px"
    >
      {/* Logo/Brand Section - Left */}
      <NavbarBrand>
        {/* Your logo placeholder - replace with image later */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
          <span className="text-green-600 font-bold text-sm">IR</span>
        </div>
        <p className="font-bold text-white hidden sm:block">Insta Recipe</p>
      </NavbarBrand>

      {/* Navigation Links - Center */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link 
            href="#" 
            className="text-white hover:text-green-300 transition-colors font-medium text-sm"
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="/recipes" 
            className="text-white hover:text-green-300 transition-colors font-medium text-sm"
          >
            Recipes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="#" 
            className="text-white hover:text-green-300 transition-colors font-medium text-sm"
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="#" 
            className="text-white hover:text-green-300 transition-colors font-medium text-sm"
          >
            More
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="#" 
            className="text-white hover:text-green-300 transition-colors font-medium text-sm"
          >
            Bhat Bhaji
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Right Section - Empty for balance */}
      <NavbarContent justify="end">
        <NavbarItem>
          {/* Empty for now, can add user menu etc. later */}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;