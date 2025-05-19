
// Audio format utility functions and types

export type AudioFormat = {
  type: string;
  extension: string;
  displayName: string;
};

export const SUPPORTED_FORMATS: AudioFormat[] = [
  { type: "audio/mpeg", extension: "mp3", displayName: "MP3" },
  { type: "audio/ogg", extension: "ogg", displayName: "OGG" },
  { type: "audio/wav", extension: "wav", displayName: "WAV" },
];

export const getFormatDisplayName = (mimeType: string | null): string => {
  if (!mimeType) return "";
  const format = SUPPORTED_FORMATS.find(format => format.type === mimeType);
  return format ? format.displayName : mimeType.replace("audio/", "");
};

export const formatErrorMessage = (error: MediaError | null): string => {
  if (!error) return "Failed to load audio";
  
  // Handle the specific FFmpeg demuxer error
  if (error.message && error.message.includes("DEMUXER_ERROR_COULD_NOT_OPEN")) {
    return "Audio file is invalid or corrupted. Please check that a valid audio file exists at the specified path.";
  }
  
  switch (error.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return "Audio playback was aborted";
    case MediaError.MEDIA_ERR_NETWORK:
      return "Network error occurred while loading the audio";
    case MediaError.MEDIA_ERR_DECODE:
      return "Audio file is corrupted or uses an unsupported format";
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return "None of the audio formats are supported by your browser";
    default:
      return `Error loading audio: ${error.message || "unknown error"}`;
  }
};
