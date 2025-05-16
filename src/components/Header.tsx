import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="spacehey-header flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white text-primary rounded p-1 flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Myspace_logo.svg" alt="MySpace Logo" className="h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">MySpace</div>
            <div className="text-xs">a place for friends</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Search Users:</span>
          <input 
            type="text" 
            className="border border-gray-300 px-2 py-1 rounded text-black"
          />
          <button className="bg-gray-200 text-black px-2 py-1 rounded">Search</button>
        </div>
        
        <div className="flex gap-2">
          <Link to="/" className="text-white hover:underline">Help</Link>
          <span>|</span>
          <Link to="/" className="text-white hover:underline">LogIn</Link>
          <span>|</span>
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
