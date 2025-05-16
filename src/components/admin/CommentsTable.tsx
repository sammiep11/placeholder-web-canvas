
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  name: string;
  comment: string;
}

const CommentsTable = ({ comments, setComments, loading }: { 
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
}) => {
  const { toast } = useToast();

  const handleDeleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rsvps_comments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setComments(comments.filter((comment) => comment.id !== id));
      
      toast({
        title: "Comment deleted",
        description: "The comment has been removed."
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error deleting comment",
        description: "There was a problem deleting the comment.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <p className="text-center py-4">Loading comments...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 spacehey-table">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Comment</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {comments.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center">
                No comments yet
              </td>
            </tr>
          ) : (
            comments.map((comment) => (
              <tr key={comment.id}>
                <td className="px-4 py-2">{comment.name}</td>
                <td className="px-4 py-2">{comment.comment}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommentsTable;
