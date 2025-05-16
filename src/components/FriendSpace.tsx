
import React from 'react';
import { Link } from 'react-router-dom';

const FriendSpace = () => {
  return (
    <div className="mb-4">
      <div className="spacehey-section-header flex justify-between items-center mb-1">
        <div>Jonny's Top 8</div>
        <Link to="/friends" className="text-xs text-blue-700 hover:underline">[view all]</Link>
      </div>
      
      <div className="px-2 py-1">
        <p className="mb-2">Jonny has <span className="text-red-600 font-bold">8</span> friends.</p>
        
        <div className="flex gap-6">
          <div className="text-center">
            <div className="bg-primary p-2 w-24 h-24 flex items-center justify-center mb-1">
              <div className="bg-white text-primary rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-lg font-bold">hey</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span>SpaceHey</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-2 w-24 h-24 flex items-center justify-center mb-1">
              <div className="text-3xl font-bold">An</div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span>An</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendSpace;
