import React, { useEffect } from 'react';

// Bare minimum language selector that bypasses React for reliability
const LanguageSelector = () => {
  // Function to ensure the dropdown is visible after initialization
  const forceDropdownVisibility = () => {
    setTimeout(() => {
      const comboBox = document.querySelector('.goog-te-combo');
      if (comboBox) {
        // Apply direct inline styles to override any CSS that might be hiding it
        comboBox.style.cssText = `
          display: block !important;
          visibility: visible !important;
          width: 100% !important;
          height: auto !important;
          background-color: white !important;
          color: black !important;
          padding: 8px !important;
          margin: 15px auto !important;
          border-radius: 4px !important;
          border: 1px solid #4CAF50 !important;
          font-size: 16px !important;
          max-width: 250px !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          z-index: 100000 !important;
        `;
        
        // Also style the parent containers to ensure visibility
        const gadget = document.querySelector('.goog-te-gadget');
        if (gadget) {
          gadget.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          `;
        }
      }
      
      // Fix Google Translate banner and body position
      document.body.style.top = '0px';
      document.body.style.position = 'static';
      
      const elements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
      elements.forEach(el => {
        if (el) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
        }
      });
    }, 300);
  };

  const handleClick = () => {
    // Create and insert popup directly like in the EJS version
    if (!document.getElementById('languagePopup')) {
      const popupHTML = `
        <div id="languagePopup" class="popup" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:white;color:#333;padding:30px;font-size:18px;border-radius:10px;box-shadow:0 0 20px rgba(0,0,0,0.5);z-index:100000;min-width:300px;text-align:center;">
          <h4 style="margin-bottom:15px;color:#4CAF50;font-weight:600;">Select Language</h4>
          <button id="closePopupBtn" style="position:absolute;top:10px;right:10px;background-color:transparent;color:#666;border:none;font-size:24px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">×</button>
          <div id="google_translate_element" style="margin-top:15px;min-height:60px;"></div>
        </div>
        <div id="popupOverlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:99999;"></div>
      `;
      
      const div = document.createElement('div');
      div.innerHTML = popupHTML;
      document.body.appendChild(div);
      
      // Add event listener to close button
      const closeBtn = document.getElementById('closePopupBtn');
      const overlay = document.getElementById('popupOverlay');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const popup = document.getElementById('languagePopup');
          const overlay = document.getElementById('popupOverlay');
          if (popup) popup.parentNode.removeChild(popup);
          if (overlay) overlay.parentNode.removeChild(overlay);
        });
      }
      
      if (overlay) {
        overlay.addEventListener('click', () => {
          const popup = document.getElementById('languagePopup');
          if (popup) popup.parentNode.removeChild(popup);
          overlay.parentNode.removeChild(overlay);
        });
      }
      
      // Define Google Translate callback function
      window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        forceDropdownVisibility();
      };
      
      // Initialize Google Translate
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      } else {
        // Load Google Translate script
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  };

  // Return just the button
  return (
    <button 
      className="btn btn-success" 
      onClick={handleClick}
      style={{ margin: '0 5px' }}
    >
      <i className="bi bi-translate me-1"></i> Select Language
    </button>
  );
};

export default LanguageSelector;
