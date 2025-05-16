
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import RsvpDialog from './RsvpDialog';
import CommentDialog from './CommentDialog';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { supabase } from '@/integrations/supabase/client';

type Comment = {
  id: string;
  name: string;
  aim_screen_name: string;
  comment: string;
  created_at: string;
  type: 'rsvp' | 'comment';
};

const FriendComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  // Load comments from Supabase when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        // Fetch both standalone comments and RSVP comments that have content
        const { data, error } = await supabase
          .from('rsvps_comments')
          .select('*')
          .or('type.eq.comment,and(type.eq.rsvp,comment.neq.null,comment.neq."")')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match the Comment type
        const transformedComments = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          aim_screen_name: item.aim_screen_name,
          comment: item.comment,
          created_at: item.created_at,
          type: item.type
        }));
        
        setComments(transformedComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
    
    // Set up Supabase real-time subscription to listen for changes
    const channel = supabase
      .channel('public:rsvps_comments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'rsvps_comments' 
      }, () => {
        // When changes happen, fetch the latest data
        fetchComments();
      })
      .subscribe();
    
    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mb-4">
      <div className="spacehey-section-header flex justify-between items-center mb-1">
        <div>Jonny's Wall</div>
        <Link to="#" onClick={(e) => {
          e.preventDefault();
          setIsCommentDialogOpen(true);
        }} className="text-xs text-blue-700 hover:underline">[add comment]</Link>
      </div>
      
      <div className="px-2 py-1">
        <p className="mb-2">
          Displaying <span className="text-red-600 font-bold">{comments.length}</span> of <span className="text-red-600 font-bold">{comments.length}</span> comments
        </p>

        {isLoading ? (
          <div className="text-center py-3">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-300 rounded p-2">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 flex items-center justify-center rounded">
                      <MessageSquare size={isMobile ? 12 : 16} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div>
                      <span className="font-bold text-blue-700 text-sm sm:text-base">{comment.name}</span>
                      <span className="text-gray-500 text-xs sm:text-sm"> ({comment.aim_screen_name})</span>
                      {comment.type === 'rsvp' && (
                        <span className="text-xs bg-pink-100 text-pink-700 rounded px-1 ml-1">RSVP</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs sm:text-sm break-words">{comment.comment}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-gray-500 text-sm border border-gray-300 rounded bg-gray-50">
            No comments yet! Be the first to leave a comment.
          </div>
        )}
        
        <div className="mt-3">
          <Button 
            onClick={() => setIsRsvpDialogOpen(true)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-sm sm:text-base py-2 h-auto touch-manipulation"
          >
            RSVP to Jonny's Party
          </Button>
        </div>
      </div>
      
      <RsvpDialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen} />
      <CommentDialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen} />
    </div>
  );
};

export default FriendComments;
