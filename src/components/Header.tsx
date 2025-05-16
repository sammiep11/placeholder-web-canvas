
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
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
        
        <div className="flex items-center gap-2">
          <span className="text-white">Search Users:</span>
          <input 
            type="text" 
            className="border border-gray-300 px-2 py-1 rounded text-black"
          />
          <button className="bg-gray-200 text-black px-2 py-1 rounded">Search</button>
        </div>
        
        <div className="flex gap-2">
          <Link to="/" className="text-white hover:underline">Help</Link>
          <span className="text-white">|</span>
          <Link to="/" className="text-white hover:underline">LogIn</Link>
          <span className="text-white">|</span>
          <Link to="/" className="text-white hover:underline">SignUp</Link>
        </div>
      </div>
      
      <nav className="spacehey-secondary-nav flex gap-2">
        <Link to="/" className="hover:underline">Home</Link>
        <span>|</span>
        <Link to="/browse" className="hover:underline">Browse</Link>
        <span>|</span>
        <Link to="/search" className="hover:underline">Search</Link>
        <span>|</span>
        <Link to="/messages" className="hover:underline">Messages</Link>
        <span>|</span>
        <Link to="/blog" className="hover:underline">Blog</Link>
        <span>|</span>
        <Link to="/bulletins" className="hover:underline">Bulletins</Link>
        <span>|</span>
        <Link to="/forum" className="hover:underline">Forum</Link>
        <span>|</span>
        <Link to="/groups" className="hover:underline">Groups</Link>
        <span>|</span>
        <Link to="/layouts" className="hover:underline">Layouts</Link>
        <span>|</span>
        <Link to="/favs" className="hover:underline">Favs</Link>
        <span>|</span>
        <Link to="/invite" className="hover:underline">Invite</Link>
        <span>|</span>
        <Link to="/app" className="hover:underline">App</Link>
        <span>|</span>
        <Link to="/shop" className="hover:underline">Shop</Link>
        <span>|</span>
        <Link to="/about" className="hover:underline">About</Link>
      </nav>
    </header>
  );
};

export default Header;
