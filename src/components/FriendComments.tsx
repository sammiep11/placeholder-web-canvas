
import React from 'react';
import { Link } from 'react-router-dom';

const FriendComments = () => {
  return (
    <div className="mb-4">
      <div className="spacehey-section-header mb-1">
        Selena's Friends Comments
      </div>
      
      <div className="px-2 py-1">
        <p>
          Displaying <span className="text-red-600 font-bold">0</span> of <span className="text-red-600 font-bold">0</span> comments (
            <Link to="/comments" className="text-blue-700 hover:underline">View all</Link>
            | 
            <Link to="/add-comment" className="text-blue-700 hover:underline">Add Comment</Link>
          )
        </p>
      </div>
    </div>
  );
};

export default FriendComments;
