import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPhotos, deletePhoto } from "@/utils/photoUtils";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("rsvps");
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load RSVPs
    const storedRsvps = localStorage.getItem("rsvps");
    if (storedRsvps) {
      setRsvps(JSON.parse(storedRsvps));
    }

    // Load comments
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }

    if (activeTab === "photos") {
      // Load photos
      const allPhotos = getPhotos();
      setPhotos(allPhotos);
    }
  }, [activeTab]);

  const handleDeleteRsvp = (email: string) => {
    const updatedRsvps = rsvps.filter((rsvp) => rsvp.email !== email);
    localStorage.setItem("rsvps", JSON.stringify(updatedRsvps));
    setRsvps(updatedRsvps);
    toast({
      title: "RSVP deleted",
      description: "The RSVP has been removed."
    });
  };

  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    setComments(updatedComments);
    toast({
      title: "Comment deleted",
      description: "The comment has been removed."
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    deletePhoto(photoId);
    // Refresh the photos list
    setPhotos(getPhotos());
    toast({
      title: "Photo deleted",
      description: "The photo has been removed."
    });
  };

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
              Manage RSVPs, comments, and other site content here.
            </p>

            <Tabs defaultValue="rsvps" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              <TabsContent value="rsvps">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Manage RSVPs</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 spacehey-table">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Attending</th>
                          <th className="px-4 py-2 text-left">Guests</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {rsvps.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-2 text-center">
                              No RSVPs yet
                            </td>
                          </tr>
                        ) : (
                          rsvps.map((rsvp) => (
                            <tr key={rsvp.email}>
                              <td className="px-4 py-2">{rsvp.name}</td>
                              <td className="px-4 py-2">{rsvp.email}</td>
                              <td className="px-4 py-2">{rsvp.attending ? "Yes" : "No"}</td>
                              <td className="px-4 py-2">{rsvp.guests}</td>
                              <td className="px-4 py-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteRsvp(rsvp.email)}
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
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Manage Comments</h2>
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
                </div>
              </TabsContent>
              <TabsContent value="photos">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Manage Photos</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 spacehey-table">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left">Preview</th>
                          <th className="px-4 py-2 text-left">Album</th>
                          <th className="px-4 py-2 text-left">Caption</th>
                          <th className="px-4 py-2 text-left">Uploaded By</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {photos.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-2 text-center">
                              No photos found
                            </td>
                          </tr>
                        ) : (
                          photos.map((photo) => (
                            <tr key={photo.id}>
                              <td className="px-4 py-2">
                                <img 
                                  src={photo.src} 
                                  alt={photo.caption || "Photo"} 
                                  className="h-16 w-16 object-cover"
                                />
                              </td>
                              <td className="px-4 py-2 capitalize">{photo.album}</td>
                              <td className="px-4 py-2">{photo.caption || "-"}</td>
                              <td className="px-4 py-2">{photo.uploadedBy}</td>
                              <td className="px-4 py-2">
                                {new Date(photo.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2">
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeletePhoto(photo.id)}
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
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
