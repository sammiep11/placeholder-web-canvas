
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminSettings from "@/components/AdminSettings";
import TextMessages from "@/components/TextMessages";
import RsvpsTable from "@/components/admin/RsvpsTable";
import CommentsTable from "@/components/admin/CommentsTable";
import PhotosTable from "@/components/admin/PhotosTable";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("rsvps");
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "rsvps") {
          const { data, error } = await supabase
            .from('rsvps_comments')
            .select('*')
            .eq('type', 'rsvp')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          setRsvps(data || []);
        } else if (activeTab === "comments") {
          const { data, error } = await supabase
            .from('rsvps_comments')
            .select('*')
            .or('type.eq.comment,and(type.eq.rsvp,comment.neq.null,comment.neq."")')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          setComments(data || []);
        } else if (activeTab === "photos") {
          const { data, error } = await supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          setPhotos(data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, toast]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="spacehey-panel mb-6">
          <div className="spacehey-panel-header">
            <h1>Admin Panel</h1>
          </div>
          <div className="p-4">
            <p className="mb-4">
              Manage RSVPs, comments, messages, and other site content here.
            </p>

            <Tabs defaultValue="rsvps" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rsvps">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Manage RSVPs</h2>
                  <RsvpsTable rsvps={rsvps} setRsvps={setRsvps} loading={loading} />
                </div>
              </TabsContent>
              
              <TabsContent value="comments">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Manage Comments</h2>
                  <CommentsTable comments={comments} setComments={setComments} loading={loading} />
                </div>
              </TabsContent>
              
              <TabsContent value="photos">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Manage Photos</h2>
                  <PhotosTable photos={photos} setPhotos={setPhotos} loading={loading} />
                </div>
              </TabsContent>
              
              <TabsContent value="messages">
                <TextMessages />
              </TabsContent>
              
              <TabsContent value="settings">
                <AdminSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
