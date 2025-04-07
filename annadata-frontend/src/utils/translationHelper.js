/**
 * Helper functions for Google Translate integration
 * Simplified version focused on just fixing the display issues
 */

// Fix common Google Translate styling issues
export const fixTranslateIssues = () => {
  console.log('[translationHelper] Fixing translate issues');
  
  // Fix body positioning
  document.body.style.top = '0px';
  document.body.style.position = 'static';
  
  // Hide Google Translate banner
  const elements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
  elements.forEach(el => {
    if (el) {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
    }
  });
  
  // Remove added classes that shift the page
  document.body.classList.remove('translated-ltr');
  document.body.classList.remove('translated-rtl');
};

// Ensure Google Translate dropdown works properly
export const ensureTranslateDropdownWorks = () => {
  console.log('[translationHelper] Ensuring translate dropdown works');
  
  // Direct approach - check if Google Translate element exists
  const googleContainer = document.getElementById('google_translate_element');
  
  if (googleContainer && googleContainer.innerHTML === '') {
    console.log('[translationHelper] Empty Google translate container, attempting to initialize');
    if (window.google && window.google.translate && typeof window.googleTranslateElementInit === 'function') {
      console.log('[translationHelper] Calling googleTranslateElementInit');
      window.googleTranslateElementInit();
    }
  }
  
  // Look for the combo box and make it visible
  const combo = document.querySelector('.goog-te-combo');
  console.log('[translationHelper] Found goog-te-combo:', !!combo);
  
  if (combo) {
    // Make combo visible with important styles - use direct style property for maximum reliability
    console.log('[translationHelper] Making combo visible');
    combo.style.cssText = `
      visibility: visible !important;
      display: block !important;
      background-color: white !important;
      color: black !important;
      padding: 8px !important;
      margin: 20px 0 0 0 !important;
      width: 100% !important;
      height: auto !important;
      border-radius: 5px !important;
      border: 2px solid #4CAF50 !important;
      font-size: 16px !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 9999 !important;
      max-width: 250px !important;
    `;
    
    // Ensure the parent containers are also visible
    const gadget = document.querySelector('.goog-te-gadget');
    if (gadget) {
      gadget.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
    }
  }
};

export default {
  fixTranslateIssues,
  ensureTranslateDropdownWorks
};
