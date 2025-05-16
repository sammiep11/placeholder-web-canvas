
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { notifyAdmins } from '@/utils/smsUtils';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  aimScreenName: z.string().min(1, { message: "AIM screen name is required." }),
  comment: z.string().min(1, { message: "Comment is required." }),
});

type FormValues = z.infer<typeof formSchema>;

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommentDialog = ({ open, onOpenChange }: CommentDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      aimScreenName: "",
      comment: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get existing comments from localStorage or initialize empty array
      const existingRsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
      
      // Add new comment with timestamp
      const newComment = {
        ...data,
        date: new Date().toISOString(),
        id: Date.now().toString(),
        type: 'comment', // To distinguish from RSVPs
      };
      
      localStorage.setItem('rsvps', JSON.stringify([...existingRsvps, newComment]));
      
      // Send notification to admins
      await notifyAdmins('comment', `${data.name}: ${data.comment.substring(0, 30)}${data.comment.length > 30 ? '...' : ''}`);
      
      // Show success toast
      toast({
        title: "Comment Posted!",
        description: "Your comment has been added to Jonny's wall!",
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        title: "Something went wrong",
        description: "Your comment couldn't be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post on Jonny's Wall</DialogTitle>
          <DialogDescription>
            Leave a comment on Jonny's wall! *~so 2000s~*
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="aimScreenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AIM Screen Name</FormLabel>
                  <FormControl>
                    <Input placeholder="coolKid2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's on your mind?" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
