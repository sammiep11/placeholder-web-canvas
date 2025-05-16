
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '@/hooks/use-is-mobile';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate('/search');
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-10">
      <div className="spacehey-header flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {/* MySpace logo - person icon + text */}
            <div className="flex items-center">
              {/* Person icon */}
              <div className="mr-2 relative w-8 h-8">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0 left-0"></div>
                <div className="w-7 h-7 bg-white absolute bottom-0 left-0 rounded-tl-full rounded-tr-full"></div>
              </div>
              
              {/* myspace text */}
              <div>
                <span className="text-2xl font-bold tracking-wide text-white">myspace</span>
                <span className="text-xs align-top text-white">®</span>
                <div className="text-xs text-white mt-[-2px]">a place for friends</div>
              </div>
            </div>
          </div>
        </div>
        
        {!isMobile && (
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <span className="text-white">Search Users:</span>
            <input 
              type="text" 
              className="border border-gray-300 px-2 py-1 rounded text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              Search
            </button>
          </form>
        )}
        
        <div className="flex gap-2">
          {isMobile ? (
            <MobileMenu />
          ) : (
            <>
              <Link to="/" className="text-white hover:underline">Help</Link>
              <span className="text-white">|</span>
              <Link to="/" className="text-white hover:underline">LogIn</Link>
              <span className="text-white">|</span>
              <Link to="/" className="text-white hover:underline">SignUp</Link>
              <span className="text-white text-opacity-30 text-xs ml-2 hover:text-opacity-80">
                <Link to="/admin" title="Admin Panel">•</Link>
              </span>
            </>
          )}
        </div>
      </div>
      
      {!isMobile && (
        <nav className="spacehey-secondary-nav flex gap-2 overflow-x-auto scrollbar-none">
          <Link to="/" className="hover:underline whitespace-nowrap">Home</Link>
          <span>|</span>
          <Link to="/browse" className="hover:underline whitespace-nowrap">Browse</Link>
          <span>|</span>
          <Link to="/search" className="hover:underline whitespace-nowrap">Search</Link>
          <span>|</span>
          <Link to="/photos" className="hover:underline whitespace-nowrap">Photos</Link>
          <span>|</span>
          <Link to="/messages" className="hover:underline whitespace-nowrap">Messages</Link>
          <span>|</span>
          <Link to="/blog" className="hover:underline whitespace-nowrap">Blog</Link>
          <span>|</span>
          <Link to="/bulletins" className="hover:underline whitespace-nowrap">Bulletins</Link>
          <span>|</span>
          <Link to="/forum" className="hover:underline whitespace-nowrap">Forum</Link>
          <span>|</span>
          <Link to="/groups" className="hover:underline whitespace-nowrap">Groups</Link>
          <span>|</span>
          <Link to="/layouts" className="hover:underline whitespace-nowrap">Layouts</Link>
          <span>|</span>
          <Link to="/favs" className="hover:underline whitespace-nowrap">Favs</Link>
          <span>|</span>
          <Link to="/invite" className="hover:underline whitespace-nowrap">Invite</Link>
          <span>|</span>
          <Link to="/app" className="hover:underline whitespace-nowrap">App</Link>
          <span>|</span>
          <Link to="/shop" className="hover:underline whitespace-nowrap">Shop</Link>
          <span>|</span>
          <Link to="/about" className="hover:underline whitespace-nowrap">About</Link>
        </nav>
      )}
      
      {isMobile && (
        <div className="bg-blue-200 py-2 px-4 flex justify-center border-b border-blue-300">
          <form onSubmit={handleSearch} className="flex items-center w-full gap-2">
            <input 
              type="text" 
              className="border border-gray-300 px-2 py-1 rounded text-black flex-grow"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
