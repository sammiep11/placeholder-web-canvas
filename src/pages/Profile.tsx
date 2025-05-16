
import React from 'react';
import ProfileBlurbs from '../components/ProfileBlurbs';
import ProfileBlog from '../components/ProfileBlog';
import FriendSpace from '../components/FriendSpace';
import FriendComments from '../components/FriendComments';
import ContactInfo from '../components/ContactInfo';
import ProfileUrl from '../components/ProfileUrl';
import Interests from '../components/Interests';

const Profile = () => {
  return (
    <div className="p-4">
      <div className="text-3xl font-bold mb-4">Jonny</div>
      

          
          <div className="mb-6">
            <img 
              src="https://i.pinimg.com/originals/b9/3a/dd/b93add1dcab640d74af459979c8f7a93.jpg" 
              alt="Retro virtual pet"
              className="w-32 h-32 object-contain mx-auto border border-gray-300 p-1"
            />
          </div>
          
          <div className="mb-6">
            <div>Mood: </div>
            <div className="mb-2">View my: 
              <span className="text-blue-700 hover:underline cursor-pointer ml-1">Blog</span>
              <span> | </span>
              <span className="text-blue-700 hover:underline cursor-pointer">Forum Topics</span>
            </div>
            
            <ContactInfo />
            <ProfileUrl />
            <Interests />
          </div>
        </div>
        
        {/* Right column */}
        <div className="w-2/3">
          <ProfileBlog />
          <ProfileBlurbs />
          <FriendSpace />
          <FriendComments />
        </div>
      </div>
    </div>
  );
};

export default Profile;
