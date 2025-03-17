// Default image URLs for use throughout the application

// Add local imports for images
const baseUrl = '/static/images';

export const defaultSchemeImage = `${baseUrl}/default-scheme.jpg`;
export const defaultQuestionImage = `${baseUrl}/default-question.jpg`;
export const defaultUserImage = `${baseUrl}/default-avatar.jpg`;
export const defaultAvatarImage = `${baseUrl}/default-avatar.jpg`; 
export const defaultHeroImage = `${baseUrl}/hero.jpg`;

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
