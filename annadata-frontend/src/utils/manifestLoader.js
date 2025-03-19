// This utility helps prevent CORS issues with manifest.json during development

export const loadManifestIfNeeded = () => {
  // Check if we're in a GitHub dev environment using the hostname
  const isGithubDev = 
    window.location.hostname.includes('github.dev') ||
    window.location.hostname.includes('app.github.dev');
  
  // Skip manifest loading in GitHub dev environments to prevent CORS issues
  if (isGithubDev) {
    console.log('Running in GitHub dev environment - skipping manifest.json to prevent CORS issues');
    return;
  }
  
  // For all other environments, load the manifest
  try {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = './manifest.json';
    document.head.appendChild(link);
    console.log('PWA manifest loaded');
  } catch (error) {
    console.error('Error loading manifest:', error);
  }
};

export default loadManifestIfNeeded;
