/**
 * Default images for the application 
 * Using local assets instead of external placeholder services
 */

// Import local images
import defaultSchemeImg from '../assets/images/default-scheme.jpg';
import defaultAvatarImg from '../assets/images/default-avatar.jpg';
import defaultHeroImg from '../assets/images/default-hero.jpg';
import defaultCropImg from '../assets/images/default-crop.jpg';

// Default profile avatar image
export const defaultAvatarImage = defaultAvatarImg;

// Default scheme image when no image is provided
export const defaultSchemeImage = defaultSchemeImg;

// Hero section background for home page
export const heroBackgroundImage = defaultHeroImg;

// Fallback images for different categories
export const fallbackImages = {
  scheme: defaultSchemeImg,
  avatar: defaultAvatarImg,
  hero: defaultHeroImg,
  crop: defaultCropImg
};

// Category-specific scheme images
export const schemeTypeImages = {
  'Financial Support': defaultSchemeImg,
  'Insurance': defaultSchemeImg,
  'Agricultural Input': defaultSchemeImg,
  'default': defaultSchemeImg
};

// Export default object for all images
export const defaultImages = {
  avatarImage: defaultAvatarImage,
  schemeImage: defaultSchemeImage,
  heroBackground: heroBackgroundImage,
  fallbacks: fallbackImages,
  schemeTypes: schemeTypeImages
};

export default defaultImages;
