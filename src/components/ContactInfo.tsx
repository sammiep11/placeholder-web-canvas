
import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Phone, Music } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';

const ContactInfo = () => {
  return (
    <div className="spacehey-panel w-full">
      <div className="spacehey-panel-header">Links</div>
      <div className="p-2 space-y-2">
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
                <p className="text-sm">Text Haneda at <span className="font-medium">+1 (555) 123-4567</span> with any questions!</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* New "Party playlist" link */}
        <div className="flex items-center gap-1">
          <Music className="h-5 w-5 text-green-500" />
          <a 
            href="https://open.spotify.com/playlist/18ZtmLtuunIQSmCLWTbFC0?si=df8afae2d3a043d1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline cursor-pointer"
          >
            Party Playlist
          </a>
        </div>
        
        {/* Photos Link */}
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
            <path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          </svg>
          <Link to="/photos" className="text-blue-700 hover:underline cursor-pointer">View/add Photos</Link>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
