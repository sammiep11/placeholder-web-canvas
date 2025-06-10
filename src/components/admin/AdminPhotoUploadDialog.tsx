
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Album } from "@/pages/Photos";
import { addPhoto } from "@/utils/photoUtils";
import { useToast } from "@/hooks/use-toast";

interface AdminPhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AdminPhotoUploadDialog = ({ open, onOpenChange, onSuccess }: AdminPhotoUploadDialogProps) => {
  const { toast } = useToast();
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState<Album>("inspiration");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    setUploading(true);
    
    try {
      const newPhoto = await addPhoto({
        src: imagePreview,
        caption,
        uploadedBy: "Admin",
        album,
      });
      
      if (!newPhoto) {
        throw new Error("Failed to upload photo");
      }
      
      toast({
        title: "Photo Uploaded!",
        description: `Photo has been added to the ${album} album.`,
      });
      
      // Reset form
      setCaption("");
      setAlbum("inspiration");
      setImageFile(null);
      setImagePreview(null);
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Photo (Admin)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="album">Album</Label>
              <Select value={album} onValueChange={(value) => setAlbum(value as Album)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="throwbacks">Throwbacks of Jonny</SelectItem>
                  <SelectItem value="inspiration">Party Inspo</SelectItem>
                  <SelectItem value="party">Party Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption to this photo"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 rounded-md"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!imagePreview || uploading}
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPhotoUploadDialog;
