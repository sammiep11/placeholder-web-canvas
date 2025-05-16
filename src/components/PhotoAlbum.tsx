
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Album, Photo } from "@/pages/Photos";
import { Download } from "lucide-react";
import PhotoView from "./PhotoView";
import { getPhotos } from "@/utils/photoUtils";

interface PhotoAlbumProps {
  album: Album;
}

const PhotoAlbum = ({ album }: PhotoAlbumProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchedPhotos = getPhotos(album);
    setPhotos(fetchedPhotos);
  }, [album]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = `jonny-party-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center p-10">
        {album === "throwbacks" && (
          <p>No throwback photos yet. Be the first to add one!</p>
        )}
        {album === "inspiration" && (
          <p>No inspiration photos available yet.</p>
        )}
        {album === "party" && (
          <p>Party hasn't happened yet! Photos will be uploaded after the event.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="cursor-pointer" onClick={() => handlePhotoClick(photo)}>
              <AspectRatio ratio={4/3}>
                <img
                  src={photo.src}
                  alt={photo.caption || "Photo"}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="p-3">
              {photo.caption && <p className="text-sm mb-1">{photo.caption}</p>}
              <p className="text-xs text-muted-foreground">
                Shared by: {photo.uploadedBy}
              </p>
              {album === "party" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPhoto(photo);
                  }}
                >
                  <Download size={14} />
                  Download
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <PhotoView 
        photo={selectedPhoto} 
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)} 
      />
    </div>
  );
};

export default PhotoAlbum;
