import React from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';

const FriendSpace = () => {
  const isMobile = useIsMobile();

  const friends = [
    { name: "Tom", imgSrc: "/tom.jpeg", verified: true },
    { name: "Haneda", imgSrc: "/haneda2.jpg", verified: true },
    { name: "Liam", imgSrc: "/liam.jpg", verified: true },
    { name: "Roche", imgSrc: "/roche.jpg", verified: true },
    { name: "Cattan", imgSrc: "/cattan.jpg", verified: true },
    { name: "D", imgSrc: "/d.jpg", verified: true },
    { name: "Sammie", imgSrc: "/sammie2.jpg", verified: true },
    { name: "Mark", imgSrc: "/mark.jpg", verified: true }
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
              <div className="bg-blue-100 p-1 sm:p-2 w-[72px] h-[96px] sm:w-[96px] sm:h-[128px] flex items-center justify-center mb-1 mx-auto touch-manipulation">
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

