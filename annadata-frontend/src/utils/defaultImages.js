/**
 * Default images for the application
 */

// Default profile avatar image
export const defaultAvatarImage = 'https://res.cloudinary.com/demo/image/upload/v1612376638/samples/people/profile-placeholder.jpg';

// Default scheme image when no image is provided
export const defaultSchemeImage = 'https://res.cloudinary.com/demo/image/upload/v1612376688/samples/landscapes/agriculture-field.jpg';

// Hero section background for home page
export const heroBackgroundImage = 'https://res.cloudinary.com/demo/image/upload/v1612376705/samples/landscapes/farm-landscape.jpg';

// Fallback images for different categories
export const fallbackImages = {
  scheme: defaultSchemeImage,
  avatar: defaultAvatarImage,
  hero: heroBackgroundImage,
  crop: 'https://res.cloudinary.com/demo/image/upload/v1612376700/samples/food/vegetables.jpg'
};

// Export default object for all images
export const defaultImages = {
  avatarImage: defaultAvatarImage,
  schemeImage: defaultSchemeImage,
  heroBackground: heroBackgroundImage,
  fallbacks: fallbackImages
};

export default defaultImages;
