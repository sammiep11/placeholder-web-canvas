import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Phone, Music } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';

const ContactInfo = () => {
  return (
    <div className="spacehey-panel w-full">
      <div className="spacehey-panel-header">Links</div>
      <div className="p-2 space-y-2">
        {/* Existing links */}
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Add to Friends</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="text-blue-700 hover:underline cursor-pointer">Add to Favorites</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Send Message</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Instant Message</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Add to Group</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Forward to Friend</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Block User</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-700 hover:underline cursor-pointer">Report User</span>
        </div>

        {/* New "Directions" link */}
        <div className="flex items-center gap-1">
          <Map className="h-5 w-5 text-blue-600" />
          <a 
            href="https://www.google.com/maps/search/?api=1&query=869+Berryessa+Ave,+Milpitas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline cursor-pointer"
          >
            Directions
          </a>
        </div>

        {/* New "Questions?" link with popover */}
        <div className="flex items-center gap-1">
          <Phone className="h-5 w-5 text-blue-600" />
          <Popover>
            <PopoverTrigger asChild>
              <span className="text-blue-700 hover:underline cursor-pointer">Questions?</span>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Have questions about the party?</h4>
                <p className="text-sm">Text Jonny at <span className="font-medium">(555) 123-4567</span> with any questions!</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* New "Spotify Playlist" link */}
        <div className="flex items-center gap-1">
          <Music className="h-5 w-5 text-green-500" />
          <a 
            href="https://open.spotify.com/playlist/18ZtmLtuunIQSmCLWTbFC0?si=df8afae2d3a043d1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline cursor-pointer"
          >
            Spotify Playlist
          </a>
        </div>
        
        {/* Photos Link */}
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
            <path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          </svg>
          <Link to="/photos" className="text-blue-700 hover:underline cursor-pointer">View Photos</Link>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
