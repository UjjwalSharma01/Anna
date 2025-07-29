import React, { useEffect, useState } from 'react';

const GoogleTranslate = () => {
  const [showTranslate, setShowTranslate] = useState(false);
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  useEffect(() => {
    // Check if Google Translate is loaded
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        setIsTranslateReady(true);
      } else {
        setTimeout(checkGoogleTranslate, 100);
      }
    };
    
    checkGoogleTranslate();
  }, []);

  const toggleTranslate = () => {
    const newShowState = !showTranslate;
    setShowTranslate(newShowState);
    
    // Initialize translate widget when popup opens
    if (newShowState && isTranslateReady) {
      // Small delay to ensure DOM element exists
      setTimeout(() => {
        if (window.google && window.google.translate) {
          // Clear any existing widget first
          const element = document.getElementById('google_translate_element');
          if (element) {
            element.innerHTML = '';
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'hi,en,te,ta,bn,gu,kn,ml,mr,or,pa,ur'
            }, 'google_translate_element');
          }
        }
      }, 100);
    }
  };

  return (
    <div className="relative">
      {/* Translation Toggle Button */}
      <button
        onClick={toggleTranslate}
        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        title="Translate Page"
      >
        <span>🌐</span>
        <span className="hidden md:inline">Translate</span>
      </button>

      {/* Translation Popup/Modal */}
      {showTranslate && (
        <div className="absolute top-12 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[300px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Select Language</h3>
            <button
              onClick={toggleTranslate}
              className="text-gray-500 hover:text-gray-700 text-xl"
              title="Close"
            >
              ×
            </button>
          </div>
          
          {/* Google Translate Element */}
          <div id="google_translate_element"></div>
          
          {!isTranslateReady && (
            <div className="text-gray-500 text-sm">Loading translator...</div>
          )}
        </div>
      )}

      {/* Backdrop to close popup */}
      {showTranslate && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25"
          onClick={toggleTranslate}
        ></div>
      )}
    </div>
  );
};

export default GoogleTranslate;
