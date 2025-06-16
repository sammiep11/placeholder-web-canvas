
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileBlog = () => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">You're invited to Jonny's ~*~SuPRiSe~*~ 40th Birthday</div>
      </div>
      <div className="italic py-3">
        There are 3 rules for this party: 
        <br/>1. You don't tell Jonny about this party
        <br/>2. You don't tell Jonny about this party
        <br/>3. You RSVP via the link above and get in the Y2K spirit
      </div>
    </div>
  );
};

export default ProfileBlog;
