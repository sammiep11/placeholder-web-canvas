
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Photo } from "@/pages/Photos";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PhotoViewProps {
  photo: Photo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PhotoView = ({ photo, open, onOpenChange }: PhotoViewProps) => {
  if (!photo) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = `jonny-party-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black">
        <div className="relative">
          <img 
            src={photo.src} 
            alt={photo.caption || "Photo"} 
            className="w-full object-contain max-h-[80vh]"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-white">
            {photo.caption && <p className="text-lg mb-1">{photo.caption}</p>}
            <p className="text-sm text-gray-300">
              Shared by {photo.uploadedBy} on {new Date(photo.date).toLocaleDateString()}
            </p>
            {photo.album === "party" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download size={14} />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoView;
