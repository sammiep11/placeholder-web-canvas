
import React from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';

const FriendSpace = () => {
  const isMobile = useIsMobile();
  
  // Create an array with 8 friends data
  const friends = [
    {
      name: "Tom",
      imgSrc: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      verified: true
    },
    {
      name: "Haneda",
      imgSrc: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      verified: true
    },
    {
      name: "Liam",
      imgSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      verified: true
    },
    {
      name: "Roche",
      imgSrc: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      verified: true
    },
    {
      name: "Cattan",
      imgSrc: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      verified: true
    },
    {
      name: "Dee",
      imgSrc: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      verified: true
    },
    {
      name: "Sammie",
      imgSrc: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      verified: true
    },
    {
      name: "Mark",
      imgSrc: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      verified: true
    }
  ];

  return (
    <div className="mb-4">
      <div className="spacehey-section-header flex justify-between items-center mb-1">
        <div>Jonny's Top 8</div>
      </div>
      
      <div className="px-2 py-1">
        <p className="mb-2">Jonny has <span className="text-red-600 font-bold">8</span> friends.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {friends.map((friend, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 p-1 sm:p-2 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mb-1 mx-auto touch-manipulation">
                <img 
                  src={friend.imgSrc} 
                  alt={`${friend.name}'s profile`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm sm:text-base">{friend.name}</span>
                {friend.verified && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendSpace;
