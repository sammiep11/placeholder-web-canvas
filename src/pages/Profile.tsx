
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
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

const Profile = () => {
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="text-2xl sm:text-3xl font-bold">*~Jonny~*</div>
        <Button 
          onClick={() => setIsRsvpDialogOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold w-full sm:w-auto"
        >
          RSVP to Jonny's Party!
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left column */}
        <div className="w-full md:w-1/3">
          <div className="text-green-600 font-bold mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ONLINE!
          </div>
          
          <div className="mb-6 flex justify-center">
            <Avatar className="w-32 h-32 border border-gray-300">
              <AvatarImage 
                src="/profile-pic.jpeg" 
                alt="Profile Picture"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">J</AvatarFallback>
            </Avatar>
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
