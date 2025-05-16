
import React, { useState } from "react";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoAlbum from "@/components/PhotoAlbum";
import PhotoUploadDialog from "@/components/PhotoUploadDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export type Album = "throwbacks" | "inspiration" | "party";

export type Photo = {
  id: string;
  src: string;
  caption: string;
  uploadedBy: string;
  date: string;
  album: Album;
};

const Photos = () => {
  const [activeTab, setActiveTab] = useState<Album>("throwbacks");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as Album);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="spacehey-panel mb-4 sm:mb-6">
          <div className="spacehey-panel-header">
            <h1>Photos</h1>
          </div>
          <div className="p-2 sm:p-4">
            <p className="mb-4 text-sm sm:text-base">
              Check out photos from Jonny's past, get inspired for the party, and view/download photos from the event!
            </p>
            
            <Tabs defaultValue="throwbacks" onValueChange={handleTabChange} className="w-full">
              <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-3'}`}>
                <TabsTrigger value="throwbacks" className="text-xs sm:text-sm py-1">Throwbacks of Jonny</TabsTrigger>
                <TabsTrigger value="inspiration" className="text-xs sm:text-sm py-1">Party Inspo</TabsTrigger>
                <TabsTrigger value="party" className="text-xs sm:text-sm py-1">Party Night</TabsTrigger>
              </TabsList>
              
              <div className="flex justify-end mt-2">
                {activeTab === "throwbacks" && (
                  <Button 
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-1 text-xs sm:text-sm py-1 h-auto"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Upload size={isMobile ? 14 : 16} />
                    Add Photo
                  </Button>
                )}
              </div>
              
              <TabsContent value="throwbacks">
                <PhotoAlbum album="throwbacks" />
              </TabsContent>
              
              <TabsContent value="inspiration">
                <PhotoAlbum album="inspiration" />
              </TabsContent>
              
              <TabsContent value="party">
                <PhotoAlbum album="party" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <PhotoUploadDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen}
        album="throwbacks"
        onSuccess={() => {
          toast({
            title: "Photo uploaded!",
            description: "Thanks for sharing your throwback photo of Jonny!",
          });
        }}
      />
    </div>
  );
};

export default Photos;
