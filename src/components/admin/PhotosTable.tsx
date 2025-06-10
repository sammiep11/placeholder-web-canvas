
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deletePhoto } from "@/utils/photoUtils";
import { Upload } from "lucide-react";
import AdminPhotoUploadDialog from "./AdminPhotoUploadDialog";

interface Photo {
  id: string;
  src: string;
  caption?: string;
  uploaded_by: string;
  created_at: string;
  album: string;
}

const PhotosTable = ({ photos, setPhotos, loading }: { 
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
}) => {
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const success = await deletePhoto(photoId);
      
      if (!success) {
        throw new Error('Failed to delete photo');
      }
      
      // Refresh the photos list
      setPhotos(photos.filter(p => p.id !== photoId));
      
      toast({
        title: "Photo deleted",
        description: "The photo has been removed."
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error deleting photo",
        description: "There was a problem deleting the photo.",
        variant: "destructive"
      });
    }
  };

  const handleUploadSuccess = () => {
    // Trigger refresh of photos - parent component will handle the data fetching
    window.location.reload();
  };

  if (loading) {
    return <p className="text-center py-4">Loading photos...</p>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Photo
        </Button>
      </div>

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
                  <td className="px-4 py-2">{photo.uploaded_by}</td>
                  <td className="px-4 py-2">
                    {new Date(photo.created_at).toLocaleDateString()}
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

      <AdminPhotoUploadDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default PhotosTable;
