
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { SmsConfig, DEFAULT_SMS_CONFIG, getSmsConfig, saveSmsConfig } from '@/utils/smsUtils';

const AdminSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SmsConfig>(DEFAULT_SMS_CONFIG);
  const [adminPhone1, setAdminPhone1] = useState('');
  const [adminPhone2, setAdminPhone2] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = getSmsConfig();
    setConfig(savedConfig);
    
    // Set admin phone numbers to input fields
    if (savedConfig.adminPhoneNumbers.length > 0) {
      setAdminPhone1(savedConfig.adminPhoneNumbers[0] || '');
    }
    if (savedConfig.adminPhoneNumbers.length > 1) {
      setAdminPhone2(savedConfig.adminPhoneNumbers[1] || '');
    }
  }, []);
  
  const handleSaveConfig = () => {
    setIsSaving(true);
    
    try {
      // Update admin phone numbers array
      const phoneNumbers = [adminPhone1, adminPhone2]
        .filter(phone => phone.trim() !== '');
      
      const updatedConfig = {
        ...config,
        adminPhoneNumbers: phoneNumbers
      };
      
      // Save the configuration
      saveSmsConfig(updatedConfig);
      
      toast({
        title: 'Settings saved',
        description: 'Your SMS settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your settings.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">SMS Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Twilio Configuration</h3>
          <p className="text-sm text-muted-foreground">
            To send SMS notifications, you need to set up your Twilio account credentials.
          </p>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="twilio-sid">Twilio Account SID</Label>
            <Input
              id="twilio-sid"
              type="text"
              value={config.twilioAccountSid}
              onChange={(e) => setConfig(prev => ({ ...prev, twilioAccountSid: e.target.value }))}
              placeholder="Enter your Twilio Account SID"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="twilio-token">Twilio Auth Token</Label>
            <Input
              id="twilio-token"
              type="password"
              value={config.twilioAuthToken}
              onChange={(e) => setConfig(prev => ({ ...prev, twilioAuthToken: e.target.value }))}
              placeholder="Enter your Twilio Auth Token"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="twilio-phone">Twilio Phone Number</Label>
            <Input
              id="twilio-phone"
              type="text"
              value={config.twilioPhoneNumber}
              onChange={(e) => setConfig(prev => ({ ...prev, twilioPhoneNumber: e.target.value }))}
              placeholder="+1XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              Enter your Twilio phone number in E.164 format (e.g., +1XXXXXXXXXX)
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Admin Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Set up admin phone numbers and notification preferences.
          </p>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-phone-1">Admin Phone Number 1</Label>
            <Input
              id="admin-phone-1"
              type="tel"
              value={adminPhone1}
              onChange={(e) => setAdminPhone1(e.target.value)}
              placeholder="+1XXXXXXXXXX"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="admin-phone-2">Admin Phone Number 2</Label>
            <Input
              id="admin-phone-2"
              type="tel"
              value={adminPhone2}
              onChange={(e) => setAdminPhone2(e.target.value)}
              placeholder="+1XXXXXXXXXX"
            />
          </div>
        </div>
        
        <div className="grid gap-3 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-rsvp" className="flex-1">
              Notify on new RSVP submissions
            </Label>
            <Switch
              id="notify-rsvp"
              checked={config.notifyOnRsvp}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notifyOnRsvp: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-comment" className="flex-1">
              Notify on new comments
            </Label>
            <Switch
              id="notify-comment"
              checked={config.notifyOnComment}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notifyOnComment: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-photo" className="flex-1">
              Notify on new photo uploads
            </Label>
            <Switch
              id="notify-photo"
              checked={config.notifyOnPhoto}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notifyOnPhoto: checked }))}
            />
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleSaveConfig}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default AdminSettings;
