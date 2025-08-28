import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import forumService from '../services/forumService';

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
    
    console.log('🔍 Current user from context:', user);
    console.log('🔍 Token from localStorage:', localStorage.getItem('authToken'));
    
    if (!formData.question.trim() || !formData.description.trim() || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const postData = {
        Question: formData.question.trim(),
        Description: formData.description.trim(),
        Category: formData.category
      };

      console.log('📤 Sending post data:', postData);
      const response = await forumService.createPost(postData);
      
      if (response.success) {
        alert('Question posted successfully!');
        // Reset form
        setFormData({
          question: '',
          description: '',
          category: ''
        });
        // Navigate to forum page
        navigate('/forum');
      } else {
        throw new Error(response.message || 'Failed to post question');
      }
    } catch (error) {
      console.error('Error posting question:', error);
      alert(error.message || 'Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 via-primary-700/90 to-accent-600/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Ask the 
              <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Expert Community
              </span>
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Get expert answers from experienced farmers and agricultural specialists to solve your farming challenges
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-primary-200 text-sm">Expert Farmers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-primary-200 text-sm">Avg Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-primary-200 text-sm">Solved Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-primary-100 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ask Your Question</h2>
                <p className="text-gray-600">
                  Share your farming challenges with our community of experts and get personalized solutions
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Question Field */}
                <div>
                  <label htmlFor="question" className="block text-lg font-semibold text-gray-900 mb-3">
                    Question Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-gray-600 text-sm mb-4">
                    Be specific and concise so that our community members can understand your question clearly.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder="e.g., Is there any subsidy provided for organic farming?"
                      className="w-full px-4 py-4 pr-24 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition('question', isListening1, setIsListening1, recognition1Ref)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                        isListening1 
                          ? 'bg-red-100 text-red-700 animate-pulse border border-red-300' 
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200 border border-primary-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 3.31-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8h-2z"/>
                      </svg>
                      {isListening1 ? 'Stop' : 'Voice'}
                    </button>
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-3">
                    Detailed Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-gray-600 text-sm mb-4">
                    Provide context, background information, and any relevant details to help others understand your situation.
                  </p>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your farming situation, what you've tried, location, crop type, etc..."
                      rows="6"
                      className="w-full px-4 py-4 pr-24 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 resize-vertical text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => toggleSpeechRecognition('description', isListening2, setIsListening2, recognition2Ref)}
                      className={`absolute right-3 top-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                        isListening2 
                          ? 'bg-red-100 text-red-700 animate-pulse border border-red-300' 
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200 border border-primary-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 3.31-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8h-2z"/>
                      </svg>
                      {isListening2 ? 'Stop' : 'Voice'}
                    </button>
                  </div>
                </div>

                {/* Category Field */}
                <div>
                  <label htmlFor="category" className="block text-lg font-semibold text-gray-900 mb-3">
                    Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-gray-600 text-sm mb-4">
                    Select the most relevant category to help experts find and answer your question.
                  </p>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 text-lg bg-white"
                    required
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        Posting Question...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Post Your Question
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Voice Input Info */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl shadow-lg p-6 border border-primary-100">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 3.31-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8h-2z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-2">Voice Input Feature</h4>
                  <p className="text-primary-700 text-sm leading-relaxed">
                    Click the Voice button to use speech-to-text. We support Hindi language input. 
                    Make sure your microphone is enabled and speak clearly.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Quick Tips
              </h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1">•</span>
                  Be specific about your location and crop type
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1">•</span>
                  Include what you've already tried
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1">•</span>
                  Add photos if relevant (after posting)
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2 mt-1">•</span>
                  Use clear, simple language
                </li>
              </ul>
            </div>

            {/* Categories Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Popular Categories
              </h4>
              <div className="space-y-2">
                {categories.slice(0, 4).map((category, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    {category}
                  </div>
                ))}
                <div className="text-xs text-gray-500 mt-2">
                  +{categories.length - 4} more categories available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Question Guidelines</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these guidelines to get the best answers from our expert community
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Good Questions Include
              </h4>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span>Specific and clear problem description</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span>Relevant farming context (crops, location, season)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span>What methods you've already tried</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span>Specific expected outcomes or goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span>Proper spelling and grammar</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
              <h4 className="font-bold text-red-800 mb-4 flex items-center text-lg">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please Avoid
              </h4>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Vague or overly broad questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Multiple unrelated questions in one post</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Questions already answered recently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Personal information or sensitive data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✗</span>
                  <span>Promotional content or spam</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-primary-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="font-semibold text-primary-900 mb-2">Need Help Writing Your Question?</h5>
                <p className="text-primary-700 text-sm">
                  If you're unsure how to phrase your question, try starting with "How do I..." or "What should I do when..." 
                  Our community is here to help, regardless of your experience level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ask;
