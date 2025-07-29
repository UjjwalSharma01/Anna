import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Ask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    category: ''
  });
  const [isListening1, setIsListening1] = useState(false);
  const [isListening2, setIsListening2] = useState(false);
  
  // References to store recognition instances
  const recognition1Ref = useRef(null);
  const recognition2Ref = useRef(null);

  const categories = [
    'Agricultural Commodity',
    'Agricultural Product', 
    'Crop Insurance',
    "Farmer's Issues",
    'Livestock and Animal Husbandry',
    'Organic Farming',
    'Schemes and Subsidies'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startSpeechRecognition = (fieldName, setListening, recognitionRef) => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge for voice input.');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current = recognition;
    
    // EXACT same configuration as legacy
    recognition.lang = 'hi-IN'; // Set the language to Hindi (India)
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    setListening(true);
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      setListening(false);
      alert('Could not start speech recognition. Please try again.');
      return;
    }

    // EXACT same result handling as legacy
    recognition.onresult = function(event) {
      // Get the recognized transcript and set it as the field value (REPLACE, not append)
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        [fieldName]: transcript // REPLACE entire value like legacy
      }));
      setListening(false);
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      recognitionRef.current = null;
      
      // Simple error handling like legacy
      let errorMessage = 'Speech recognition error. Please try again.';
      if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access denied. Please allow microphone access.';
      }
      alert(errorMessage);
    };

    recognition.onend = function() {
      setListening(false);
      recognitionRef.current = null;
    };
  };

  const stopSpeechRecognition = (setListening, recognitionRef) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        setListening(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setListening(false);
      }
    }
  };

  const toggleSpeechRecognition = (fieldName, isListening, setListening, recognitionRef) => {
    if (isListening) {
      stopSpeechRecognition(setListening, recognitionRef);
    } else {
      startSpeechRecognition(fieldName, setListening, recognitionRef);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.description.trim() || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call
      console.log('Question submitted:', {
        ...formData,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });

      alert('Question posted successfully!');
      navigate('/forum');
    } catch (error) {
      console.error('Error posting question:', error);
      alert('Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">❓ Ask a Question</h1>
          <p className="text-xl opacity-90">Get answers from our farming community</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Field */}
              <div>
                <label htmlFor="question" className="block text-lg font-semibold text-gray-900 mb-2">
                  Question *
                </label>
                <p className="text-gray-600 text-sm mb-3">
                  Be specific to the question you're going to ask so that our community members can understand and reply.
                </p>
                <div className="relative">
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Is there any subsidy provided for organic farming?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleSpeechRecognition('question', isListening1, setIsListening1, recognition1Ref)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      isListening1 
                        ? 'bg-red-100 text-red-700 animate-pulse' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isListening1 ? '🛑 Stop' : '🎤 Voice'}
                  </button>
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <p className="text-gray-600 text-sm mb-3">
                  Explain your question in brief and give references to better understand your question.
                </p>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your question..."
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleSpeechRecognition('description', isListening2, setIsListening2, recognition2Ref)}
                    className={`absolute right-3 top-3 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      isListening2 
                        ? 'bg-red-100 text-red-700 animate-pulse' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isListening2 ? '🛑 Stop' : '🎤 Voice'}
                  </button>
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-lg font-semibold text-gray-900 mb-2">
                  Category *
                </label>
                <p className="text-gray-600 text-sm mb-3">
                  Choose the most relevant category for your question.
                </p>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting Question...
                    </div>
                  ) : (
                    '📝 Post Question'
                  )}
                </button>
              </div>
            </form>

            {/* Speech Recognition Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Voice Input Feature</h4>
                  <p className="text-blue-700 text-sm">
                    Click the 🎤 Voice button to use speech-to-text. We support Hindi language input. 
                    Make sure your microphone is enabled and speak clearly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📋 Question Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3">✅ Good Questions Include:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Specific and clear problem description</li>
                  <li>• Relevant farming context (crops, location, etc.)</li>
                  <li>• What you've already tried</li>
                  <li>• Specific expected outcomes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-3">❌ Avoid:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Vague or overly broad questions</li>
                  <li>• Multiple unrelated questions in one post</li>
                  <li>• Questions already answered recently</li>
                  <li>• Personal information or sensitive data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask;
