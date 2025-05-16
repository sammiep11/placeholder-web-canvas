
import { supabase } from "@/integrations/supabase/client";
import { Album, Photo } from "@/pages/Photos";

// Initial photos for the inspiration album (will be migrated to Supabase)
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

// One-time migration function
const migrateLegacyPhotos = async () => {
  // Check if we've already migrated
  const { data: existingPhotos } = await supabase
    .from('photos')
    .select('id')
    .limit(1);
  
  // If we already have photos in the database, don't migrate
  if (existingPhotos && existingPhotos.length > 0) return;
  
  // Get photos from localStorage
  const localStoragePhotos = localStorage.getItem("jonny-party-photos");
  if (!localStoragePhotos) {
    // If no local photos, insert the initial photos
    for (const photo of initialPhotos) {
      await supabase.from('photos').insert({
        src: photo.src,
        caption: photo.caption,
        uploaded_by: photo.uploadedBy,
        album: photo.album,
        created_at: new Date(photo.date).toISOString()
      });
    }
    return;
  }

  // Migrate existing local photos
  const photos = JSON.parse(localStoragePhotos) as Photo[];
  for (const photo of photos) {
    await supabase.from('photos').insert({
      src: photo.src,
      caption: photo.caption,
      uploaded_by: photo.uploadedBy,
      album: photo.album,
      created_at: new Date(photo.date).toISOString()
    });
  }
};

// Get all photos from Supabase
export const getPhotos = async (album?: Album): Promise<Photo[]> => {
  // Attempt to migrate legacy photos
  await migrateLegacyPhotos();
  
  let query = supabase
    .from('photos')
    .select('*');
  
  if (album) {
    query = query.eq('album', album);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
  
  // Transform the Supabase data to match our Photo type
  return (data || []).map(photo => ({
    id: photo.id,
    src: photo.src,
    caption: photo.caption || "",
    uploadedBy: photo.uploaded_by,
    date: photo.created_at,
    album: photo.album as Album
  }));
};

// Upload a photo to Supabase Storage
async function uploadImageToStorage(file: string, fileName: string): Promise<string | null> {
  try {
    // Convert base64 data URL to Blob
    const base64Data = file.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    // Create a unique file path
    const filePath = `${Date.now()}-${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('photos')
      .upload(filePath, blob);
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('photos')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    return null;
  }
}

// Add a new photo
export const addPhoto = async ({ src, caption, uploadedBy, album }: Omit<Photo, "id" | "date">): Promise<Photo | null> => {
  try {
    // If src is a base64 string, upload to storage first
    let finalSrc = src;
    let storagePath = null;
    
    if (src.startsWith('data:image')) {
      const fileName = `${uploadedBy}-${Date.now()}.jpg`;
      const uploadedUrl = await uploadImageToStorage(src, fileName);
      
      if (!uploadedUrl) {
        throw new Error('Failed to upload image to storage');
      }
      
      finalSrc = uploadedUrl;
      storagePath = fileName;
    }
    
    // Insert photo record into database
    const { data, error } = await supabase
      .from('photos')
      .insert({
        src: finalSrc,
        storage_path: storagePath,
        caption: caption || null,
        uploaded_by: uploadedBy,
        album
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding photo to database:', error);
      return null;
    }
    
    // Transform to Photo type
    return {
      id: data.id,
      src: data.src,
      caption: data.caption || "",
      uploadedBy: data.uploaded_by,
      date: data.created_at,
      album: data.album as Album
    };
  } catch (error) {
    console.error('Error in addPhoto:', error);
    return null;
  }
};

// Delete a photo
export const deletePhoto = async (photoId: string): Promise<boolean> => {
  try {
    // Get photo storage path
    const { data: photoData } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('id', photoId)
      .single();
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);
    
    if (dbError) {
      console.error('Error deleting photo from database:', dbError);
      return false;
    }
    
    // If photo is stored in our storage, delete it
    if (photoData?.storage_path) {
      const { error: storageError } = await supabase
        .storage
        .from('photos')
        .remove([photoData.storage_path]);
        
      if (storageError) {
        console.error('Error deleting photo from storage:', storageError);
        // We continue because we still deleted the db record
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePhoto:', error);
    return false;
  }
};
