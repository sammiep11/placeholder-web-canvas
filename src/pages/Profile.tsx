
import React, { useState } from 'react';
import ProfileBlurbs from '../components/ProfileBlurbs';
import ProfileBlog from '../components/ProfileBlog';
import FriendSpace from '../components/FriendSpace';
import FriendComments from '../components/FriendComments';
import ContactInfo from '../components/ContactInfo';
import ProfileUrl from '../components/ProfileUrl';
import Interests from '../components/Interests';
import RsvpDialog from '../components/RsvpDialog';
import { Button } from '../components/ui/button';

const Profile = () => {
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-3xl font-bold">Jonny</div>
        <Button 
          onClick={() => setIsRsvpDialogOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold"
        >
          RSVP to Jonny's Party!
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column */}
        <div className="w-full md:w-1/3">
          <div className="text-green-600 font-bold mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ONLINE!
          </div>
          
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
        <div className="w-full md:w-2/3">
          <ProfileBlog />
          <ProfileBlurbs />
          <FriendSpace />
          <FriendComments />
        </div>
      </div>
      
      <RsvpDialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen} />
    </div>
  );
};

export default Profile;
