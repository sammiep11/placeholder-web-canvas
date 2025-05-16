
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import RsvpDialog from './RsvpDialog';

type RsvpComment = {
  id: string;
  name: string;
  aimScreenName: string;
  comment: string;
  date: string;
};

const FriendComments = () => {
  const [comments, setComments] = useState<RsvpComment[]>([]);
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  
  // Load comments from localStorage whenever component mounts
  useEffect(() => {
    const loadComments = () => {
      try {
        const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
        // Filter RSVPs that have comments
        const rsvpComments = rsvps
          .filter((rsvp: any) => rsvp.comment && rsvp.comment.trim() !== '')
          .map((rsvp: any) => ({
            id: rsvp.id,
            name: rsvp.name,
            aimScreenName: rsvp.aimScreenName,
            comment: rsvp.comment,
            date: rsvp.date,
          }));
        setComments(rsvpComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };

    loadComments();
    // Set up an interval to check for new comments
    const intervalId = setInterval(loadComments, 10000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mb-4 border border-gray-300 rounded">
      <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-2 font-bold border-b border-gray-300">
        Jonny's Friends Comments
      </div>
      
      <div className="px-4 py-2">
        <p className="mb-4">
          Displaying <span className="text-red-600 font-bold">{comments.length}</span> of <span className="text-red-600 font-bold">{comments.length}</span> comments (
            <Link to="#" onClick={(e) => {
              e.preventDefault();
              setIsRsvpDialogOpen(true);
            }} className="text-blue-700 hover:underline">Add Comment</Link>
          )
        </p>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-300 rounded p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                      <MessageSquare size={20} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-blue-700">
                      {comment.name} <span className="font-normal text-gray-500">({comment.aimScreenName})</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(comment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div>{comment.comment}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No comments yet! Be the first to leave a comment.</div>
        )}
        
        <div className="mt-4">
          <Button 
            onClick={() => setIsRsvpDialogOpen(true)}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            RSVP to Jonny's Party
          </Button>
        </div>
      </div>
      
      <RsvpDialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen} />
    </div>
  );
};

export default FriendComments;
