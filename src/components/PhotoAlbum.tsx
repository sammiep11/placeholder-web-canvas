
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Album, Photo } from "@/pages/Photos";
import { Download } from "lucide-react";
import PhotoView from "./PhotoView";
import { getPhotos } from "@/utils/photoUtils";
import { useIsMobile } from "@/hooks/use-is-mobile";

interface PhotoAlbumProps {
  album: Album;
}

const PhotoAlbum = ({ album }: PhotoAlbumProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      const fetchedPhotos = await getPhotos(album);
      setPhotos(fetchedPhotos);
      setLoading(false);
    };
    
    fetchPhotos();
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

  if (loading) {
    return (
      <div className="text-center p-4 sm:p-10">
        <p>Loading photos...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center p-4 sm:p-10 text-sm sm:text-base">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 auto-rows-auto">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden touch-manipulation">
            <div className="cursor-pointer" onClick={() => handlePhotoClick(photo)}>
              <img
                src={photo.src}
                alt={photo.caption || "Photo"}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-2 sm:p-3">
              {photo.caption && <p className="text-xs sm:text-sm mb-1">{photo.caption}</p>}
              <p className="text-xs text-muted-foreground">
                Shared by: {photo.uploadedBy}
              </p>
              {album === "party" && (
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="mt-2 w-full flex items-center gap-1 text-xs sm:text-sm py-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPhoto(photo);
                  }}
                >
                  <Download size={isMobile ? 12 : 14} />
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
