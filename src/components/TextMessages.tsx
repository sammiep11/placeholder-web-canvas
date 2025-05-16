
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { 
  getPhoneNumbersFromRsvps, 
  sendTextBlast, 
  getSmsConfig 
} from '@/utils/smsUtils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TextMessages = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [audienceType, setAudienceType] = useState('attending');
  const [isSending, setIsSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isTwilioConfigured, setIsTwilioConfigured] = useState(false);
  
  useEffect(() => {
    // Check if Twilio is configured
    const config = getSmsConfig();
    setIsTwilioConfigured(
      !!config.twilioAccountSid && 
      !!config.twilioAuthToken && 
      !!config.twilioPhoneNumber
    );
    
    // Update recipient count based on selection
    const recipients = getPhoneNumbersFromRsvps(audienceType === 'attending');
    setRecipientCount(recipients.length);
  }, [audienceType]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: 'Empty message',
        description: 'Please enter a message to send.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Get recipients based on selected audience type
      const recipients = getPhoneNumbersFromRsvps(audienceType === 'attending');
      
      if (recipients.length === 0) {
        toast({
          title: 'No recipients',
          description: 'There are no recipients to send messages to.',
          variant: 'destructive'
        });
        setIsSending(false);
        return;
      }
      
      // Send text blast
      const result = await sendTextBlast(message, recipients);
      
      if (result.success) {
        toast({
          title: 'Messages sent',
          description: `Successfully sent ${result.sent} messages. ${result.failed > 0 ? `Failed: ${result.failed}` : ''}`,
        });
        setMessage('');
      } else {
        toast({
          title: 'Failed to send messages',
          description: result.errors[0] || 'There was an error sending messages',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending messages:', error);
      toast({
        title: 'Error sending messages',
        description: 'There was an unexpected error sending messages.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
      setConfirmDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Send Text Messages</h2>
      
      {!isTwilioConfigured && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 mb-4">
          <div className="flex">
            <div className="text-yellow-800">
              <p className="text-sm font-medium">
                Twilio is not configured
              </p>
              <p className="text-xs mt-1">
                Please configure your Twilio account in the Settings tab before sending messages.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="audience">Select Recipients</Label>
          <RadioGroup 
            id="audience" 
            defaultValue="attending" 
            value={audienceType}
            onValueChange={setAudienceType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="attending" id="attending" />
              <Label htmlFor="attending">Only those attending or maybe attending ({getPhoneNumbersFromRsvps(true).length})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All RSVPs ({getPhoneNumbersFromRsvps(false).length})</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Text Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {message.length} / 160 characters
            {message.length > 160 && ' (multiple SMS may be sent)'}
          </p>
        </div>
        
        <div className="pt-2">
          <Button
            onClick={() => setConfirmDialogOpen(true)}
            disabled={isSending || !message.trim() || recipientCount === 0 || !isTwilioConfigured}
          >
            {isSending ? 'Sending...' : `Send to ${recipientCount} recipients`}
          </Button>
        </div>
      </div>
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm message blast</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send a text message to {recipientCount} recipients. 
              This will use your Twilio account credits. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendMessage}>
              Yes, Send Messages
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TextMessages;
