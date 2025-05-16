
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { notifyAdmins } from '@/utils/smsUtils';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  aimScreenName: z.string().min(1, { message: "AIM screen name is required." }),
  attendance: z.enum(["yes", "no", "maybe"], { 
    required_error: "Please select if you're attending." 
  }),
  guests: z.string().optional(),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RsvpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RsvpDialog = ({ open, onOpenChange }: RsvpDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      aimScreenName: "",
      attendance: "yes",
      guests: "0",
      comment: "",
    },
  });

  const migrateExistingRsvps = async () => {
    try {
      // Check if migration has been done
      const { count } = await supabase
        .from('rsvps_comments')
        .select('*', { count: 'exact', head: true });
        
      if (count && count > 0) {
        // Already migrated
        return;
      }
      
      // Get existing RSVPs from localStorage
      const existingRsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
      
      // Bulk insert
      if (existingRsvps.length > 0) {
        const formattedRsvps = existingRsvps.map((rsvp: any) => ({
          name: rsvp.name,
          aim_screen_name: rsvp.aimScreenName || '',
          phone: rsvp.phone || '',
          attendance: rsvp.attendance || 'yes',
          guests: parseInt(rsvp.guests || '0'),
          comment: rsvp.comment || '',
          type: rsvp.type || 'rsvp',
          created_at: rsvp.date || new Date().toISOString()
        }));
        
        await supabase.from('rsvps_comments').insert(formattedRsvps);
      }
    } catch (error) {
      console.error('Error migrating RSVPs:', error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Migrate existing RSVPs if this is our first Supabase RSVP
      await migrateExistingRsvps();
      
      // Add new RSVP with timestamp
      const { error } = await supabase.from('rsvps_comments').insert({
        name: data.name,
        aim_screen_name: data.aimScreenName,
        phone: data.phone,
        attendance: data.attendance,
        guests: parseInt(data.guests || '0'),
        comment: data.comment || null,
        type: 'rsvp',
      });
      
      if (error) {
        throw error;
      }
      
      // Send notification to admins
      await notifyAdmins('rsvp', `${data.name} (${data.attendance})`);
      
      // Show success toast
      toast({
        title: "RSVP Submitted!",
        description: "Thanks for responding to Jonny's party invite!",
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving RSVP:', error);
      toast({
        title: "Something went wrong",
        description: "Your RSVP couldn't be submitted. Please try again.",
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
          <DialogTitle>RSVP to Jonny's Party</DialogTitle>
          <DialogDescription>
            Let us know if you can make it to the party! *~so 2000s~*
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 555-5555" type="tel" {...field} />
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
              name="attendance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Are you attending?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="maybe" />
                        </FormControl>
                        <FormLabel className="font-normal">Maybe</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of guests</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
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
                  <FormLabel>Comment (will appear in comments section)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Can't wait to see you there!" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RsvpDialog;
