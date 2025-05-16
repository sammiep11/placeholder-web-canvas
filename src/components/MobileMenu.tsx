
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="lg:hidden">
      <Button 
        variant="ghost" 
        className="p-1" 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <Menu size={24} className="text-white" />
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-primary z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <Button 
              variant="ghost" 
              className="p-1" 
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X size={24} className="text-white" />
            </Button>
          </div>
          
          <div className="flex flex-col gap-4 p-6 text-white text-lg">
            <Link to="/" className="hover:underline" onClick={toggleMenu}>Home</Link>
            <Link to="/browse" className="hover:underline" onClick={toggleMenu}>Browse</Link>
            <Link to="/search" className="hover:underline" onClick={toggleMenu}>Search</Link>
            <Link to="/photos" className="hover:underline" onClick={toggleMenu}>Photos</Link>
            <Link to="/messages" className="hover:underline" onClick={toggleMenu}>Messages</Link>
            <Link to="/blog" className="hover:underline" onClick={toggleMenu}>Blog</Link>
            <Link to="/bulletins" className="hover:underline" onClick={toggleMenu}>Bulletins</Link>
            <Link to="/forum" className="hover:underline" onClick={toggleMenu}>Forum</Link>
            <Link to="/groups" className="hover:underline" onClick={toggleMenu}>Groups</Link>
            <Link to="/layouts" className="hover:underline" onClick={toggleMenu}>Layouts</Link>
            <Link to="/favs" className="hover:underline" onClick={toggleMenu}>Favs</Link>
            <Link to="/invite" className="hover:underline" onClick={toggleMenu}>Invite</Link>
            <Link to="/app" className="hover:underline" onClick={toggleMenu}>App</Link>
            <Link to="/shop" className="hover:underline" onClick={toggleMenu}>Shop</Link>
            <Link to="/about" className="hover:underline" onClick={toggleMenu}>About</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
