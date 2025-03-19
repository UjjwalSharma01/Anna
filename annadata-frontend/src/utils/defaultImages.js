// Default image URLs for use throughout the application

// Use placeholder images from a reliable external source rather than missing local files
const placeholderUrl = 'https://placehold.co/600x400?text=';

export const defaultSchemeImage = `${placeholderUrl}Scheme`;
export const defaultQuestionImage = `${placeholderUrl}Question`;
export const defaultUserImage = `${placeholderUrl}User`;
export const defaultAvatarImage = `${placeholderUrl}Avatar`; 
export const defaultHeroImage = `${placeholderUrl}AnnadataHero`;

// Remove base64 fallbacks and use actual image paths
export const fallbackImages = {
  scheme: defaultSchemeImage,
  question: defaultQuestionImage,
  user: defaultUserImage,
  hero: defaultHeroImage,
  default: defaultHeroImage
};

export default {
  defaultSchemeImage,
  defaultQuestionImage,
  defaultUserImage,
  defaultAvatarImage,
  defaultHeroImage,
  fallbackImages
};
