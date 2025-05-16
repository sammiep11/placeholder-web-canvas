
import { Album, Photo } from "@/pages/Photos";

// Initial photos for the inspiration album
const initialPhotos: Photo[] = [
  {
    id: "insp-1",
    src: "https://images.unsplash.com/photo-1482575832494-771f74bf6857",
    caption: "Party decoration inspiration",
    uploadedBy: "Admin",
    date: new Date("2023-04-10").toISOString(),
    album: "inspiration"
  },
  {
    id: "insp-2",
    src: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28",
    caption: "Lighting ideas for the party",
    uploadedBy: "Admin",
    date: new Date("2023-04-12").toISOString(),
    album: "inspiration"
  },
  {
    id: "insp-3",
    src: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
    caption: "DJ booth setup inspiration",
    uploadedBy: "Admin",
    date: new Date("2023-04-15").toISOString(),
    album: "inspiration"
  },
  {
    id: "party-1",
    src: "https://images.unsplash.com/photo-1496024840928-4c417adf211d",
    caption: "Sample party photo (will be replaced with actual photos)",
    uploadedBy: "Admin",
    date: new Date("2023-05-01").toISOString(),
    album: "party"
  },
  {
    id: "party-2",
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    caption: "Sample DJ booth (will be replaced with actual photos)",
    uploadedBy: "Admin",
    date: new Date("2023-05-01").toISOString(),
    album: "party"
  }
];

// Storage keys
const PHOTOS_STORAGE_KEY = "jonny-party-photos";

// Initialize storage with initial photos if empty
const initializeStorage = () => {
  const existingPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
  if (!existingPhotos) {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(initialPhotos));
  }
};

// Get all photos from storage
export const getPhotos = (album?: Album): Photo[] => {
  initializeStorage();
  const photos = JSON.parse(localStorage.getItem(PHOTOS_STORAGE_KEY) || "[]") as Photo[];
  
  if (album) {
    return photos.filter(photo => photo.album === album);
  }
  
  return photos;
};

// Add a new photo
export const addPhoto = ({ src, caption, uploadedBy, album }: Omit<Photo, "id" | "date">) => {
  const photos = getPhotos();
  
  const newPhoto: Photo = {
    id: `photo-${Date.now()}`,
    src,
    caption: caption || "",
    uploadedBy,
    date: new Date().toISOString(),
    album,
  };
  
  localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify([...photos, newPhoto]));
  return newPhoto;
};

// Delete a photo
export const deletePhoto = (photoId: string) => {
  const photos = getPhotos();
  const updatedPhotos = photos.filter(p => p.id !== photoId);
  localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(updatedPhotos));
};
