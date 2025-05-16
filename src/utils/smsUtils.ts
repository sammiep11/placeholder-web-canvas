import { useToast } from "@/hooks/use-toast";

// Types for SMS functionality
export interface SmsConfig {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  adminPhoneNumbers: string[];
  notifyOnRsvp: boolean;
  notifyOnComment: boolean;
  notifyOnPhoto: boolean;
}

// Default SMS configuration
export const DEFAULT_SMS_CONFIG: SmsConfig = {
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioPhoneNumber: '',
  adminPhoneNumbers: [],
  notifyOnRsvp: true,
  notifyOnComment: true,
  notifyOnPhoto: true,
};

// Get SMS configuration from localStorage
export const getSmsConfig = (): SmsConfig => {
  try {
    const storedConfig = localStorage.getItem('smsConfig');
    return storedConfig ? JSON.parse(storedConfig) : DEFAULT_SMS_CONFIG;
  } catch (error) {
    console.error('Error loading SMS config:', error);
    return DEFAULT_SMS_CONFIG;
  }
};

// Save SMS configuration to localStorage
export const saveSmsConfig = (config: SmsConfig): void => {
  localStorage.setItem('smsConfig', JSON.stringify(config));
};

// Send SMS notification using Twilio
export const sendSmsNotification = async (
  to: string,
  body: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const config = getSmsConfig();
    
    // Check if Twilio credentials are configured
    if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioPhoneNumber) {
      return { success: false, message: 'Twilio is not configured' };
    }

    // Create Twilio API request URL
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`;
    
    // Prepare form data for Twilio API
    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', config.twilioPhoneNumber);
    formData.append('Body', body);

    // Create base64 auth string for Twilio API
    const auth = btoa(`${config.twilioAccountSid}:${config.twilioAuthToken}`);
    
    // Send request to Twilio API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send SMS');
    }

    return { success: true, message: 'SMS sent successfully' };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return { success: false, message: error.message || 'Failed to send SMS' };
  }
};

// Send admin notification for new events
export const notifyAdmins = async (
  eventType: 'rsvp' | 'comment' | 'photo',
  details: string
): Promise<void> => {
  const config = getSmsConfig();
  
  // Check if notifications are enabled for this event type
  let shouldNotify = false;
  
  switch (eventType) {
    case 'rsvp':
      shouldNotify = config.notifyOnRsvp;
      break;
    case 'comment':
      shouldNotify = config.notifyOnComment;
      break;
    case 'photo':
      shouldNotify = config.notifyOnPhoto;
      break;
  }
  
  if (!shouldNotify) return;
  
  // Prepare notification message
  const eventMessages = {
    rsvp: 'New RSVP submission',
    comment: 'New comment posted',
    photo: 'New photo uploaded'
  };
  
  const message = `${eventMessages[eventType]}: ${details}`;
  
  // Send SMS to each admin phone number
  for (const phoneNumber of config.adminPhoneNumbers) {
    if (phoneNumber.trim()) {
      await sendSmsNotification(phoneNumber, message);
    }
  }
};

// Send bulk SMS messages (text blast)
export const sendTextBlast = async (
  message: string,
  recipients: string[]
): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> => {
  const config = getSmsConfig();
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  
  // Check if Twilio is configured
  if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioPhoneNumber) {
    return { 
      success: false, 
      sent: 0, 
      failed: recipients.length,
      errors: ['Twilio is not configured'] 
    };
  }
  
  // Send message to each recipient
  for (const recipient of recipients) {
    try {
      const result = await sendSmsNotification(recipient, message);
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push(`Failed to send to ${recipient}: ${result.message}`);
      }
    } catch (error: any) {
      failed++;
      errors.push(`Error sending to ${recipient}: ${error.message}`);
    }
  }
  
  return {
    success: sent > 0,
    sent,
    failed,
    errors
  };
};

// Extract phone numbers from RSVPs
export const getPhoneNumbersFromRsvps = (onlyAttending: boolean = false): string[] => {
  try {
    const storageData = localStorage.getItem('rsvps');
    if (!storageData) return [];
    
    const allRsvps = JSON.parse(storageData) as Array<{
      type: string;
      phone?: string;
      attendance?: string;
    }>;
    
    const filteredRsvps = allRsvps.filter((rsvp) => {
      // Only get entries with type 'rsvp' and phone numbers
      if (rsvp.type !== 'rsvp' || !rsvp.phone) return false;
      
      // If onlyAttending is true, filter for yes/maybe responses
      if (onlyAttending) {
        return rsvp.attendance === 'yes' || rsvp.attendance === 'maybe';
      }
      
      return true;
    });
    
    // Extract unique phone numbers
    const phoneNumbers = filteredRsvps.map((rsvp) => rsvp.phone as string);
    return [...new Set(phoneNumbers)]; // Remove duplicates
  } catch (error) {
    console.error('Error getting phone numbers:', error);
    return [];
  }
};
