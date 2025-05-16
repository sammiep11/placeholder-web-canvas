
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileBlog = () => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">Selena's Latest Blog Entries</div>
        <Link to="/blog" className="text-blue-700 hover:underline">[View Blog]</Link>
      </div>
      <div className="italic py-3">
        There are no Blog Entries yet.
      </div>
    </div>
  );
};

export default ProfileBlog;
