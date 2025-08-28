import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import schemesService from '../services/schemesService';

const Schemes = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schemes');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  // Government Schemes Data
  const allSchemes = [
    { 
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Financial support of ₹6,000 per year to small and marginal farmers',
      category: 'Financial Support'
    },
    { 
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', 
      link: 'https://www.youtube.com/watch?v=kAlNM6G6cC4',
      description: 'Crop insurance scheme to protect farmers from crop losses',
      category: 'Insurance'
    },
    { 
      name: 'National Mission for Sustainable Agriculture (NMSA)', 
      link: 'https://www.youtube.com/watch?v=SFKz_aEFfZw',
      description: 'Promoting sustainable agricultural practices and climate resilience',
      category: 'Sustainability'
    },
    { 
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)', 
      link: 'https://www.youtube.com/watch?v=_JTaN927MKc',
      description: 'Promoting organic farming through cluster-based approach',
      category: 'Organic Farming'
    },
    { 
      name: 'Soil Health Card Scheme', 
      link: 'https://www.youtube.com/watch?v=ViYTVlOA1FY',
      description: 'Providing soil health information to farmers for better crop management',
      category: 'Soil Health'
    },
    { 
      name: 'Rashtriya Krishi Vikas Yojana (RKVY)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'State plan scheme for agricultural and allied sector development',
      category: 'Development'
    },
    { 
      name: 'National Livestock Mission (NLM)', 
      link: 'https://youtu.be/jGMnxpLjQ4s?si=uSqIPJ_xkuu0ezfp',
      description: 'Sustainable development of livestock sector',
      category: 'Livestock'
    },
    { 
      name: 'National Beekeeping and Honey Mission (NBHM)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Promoting beekeeping and honey production',
      category: 'Apiculture'
    },
    { 
      name: 'Animal Husbandry Infrastructure Development Fund (AHIDF)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Infrastructure development for animal husbandry sector',
      category: 'Infrastructure'
    },
    { 
      name: 'Kisan Credit Card (KCC)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Credit facility for agricultural and allied activities',
      category: 'Credit'
    }
  ];

  // NGOs Data
  const allNgos = [
    { 
      name: 'Aahwahan', 
      link: 'https://www.aahwahan.com/',
      description: 'Working towards rural development and farmer empowerment',
      focus: 'Rural Development'
    },
    { 
      name: 'End Poverty', 
      link: 'https://www.endpoverty.org.in/',
      description: 'Focused on poverty alleviation through sustainable agriculture',
      focus: 'Poverty Alleviation'
    },
    { 
      name: 'Swades Foundation', 
      link: 'https://swadesfoundation.org/',
      description: 'Rural development through community participation',
      focus: 'Community Development'
    },
    { 
      name: 'Universal Versatile Society', 
      link: 'https://uvsociety.org/home',
      description: 'Promoting sustainable farming practices and rural development',
      focus: 'Sustainable Farming'
    },
    { 
      name: 'Dilasa', 
      link: 'https://dilasa.org/',
      description: 'Supporting farmers through technology and innovation',
      focus: 'Technology & Innovation'
    },
    { 
      name: 'Watershed Organization Trust', 
      link: 'https://wotr.org/',
      description: 'Watershed development and climate resilience',
      focus: 'Water Conservation'
    },
    { 
      name: 'Vrutti', 
      link: 'https://vruttiimpactcatalysts.org/vrutti/',
      description: 'Sustainable livelihood solutions for farmers',
      focus: 'Livelihood'
    },
    { 
      name: 'BAIF Development Research Foundation', 
      link: 'https://www.baif.org.in/',
      description: 'Research and development for rural communities',
      focus: 'Research & Development'
    },
    { 
      name: 'Nav Bharat Jagriti Kendra (NBJK)', 
      link: 'https://www.nbjk.org/',
      description: 'Rural awakening and development initiatives',
      focus: 'Rural Awakening'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLinkClick = (link) => {
    window.open(link, '_blank');
  };

  const handleRefresh = async () => {
    console.log('🔄 Refresh button clicked!');
    setRefreshing(true);
    setRefreshMessage('');
    
    try {
      console.log('📡 Calling schemesService.refreshSchemes()...');
      const response = await schemesService.refreshSchemes();
      console.log('✅ Response received:', response);
      setRefreshMessage(`✅ Data refreshed successfully! Last updated: ${new Date(response.lastUpdated).toLocaleTimeString()}`);
      
      // Auto-clear message after 5 seconds
      setTimeout(() => {
        setRefreshMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error refreshing schemes:', error);
      setRefreshMessage('❌ Failed to refresh data. Please try again.');
      
      // Auto-clear error message after 5 seconds
      setTimeout(() => {
        setRefreshMessage('');
      }, 5000);
    } finally {
      setRefreshing(false);
      console.log('🏁 Refresh process completed');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-green-600 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">🏛️ Government Schemes & NGOs</h1>
            <p className="text-xl opacity-90">Discover resources and support for farmers</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'schemes'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              🏛️ Government Schemes
            </button>
            <button
              onClick={() => setActiveTab('ngos')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'ngos'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              🤝 NGOs & Organizations
            </button>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`${
              refreshing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2`}
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh Data
              </>
            )}
          </button>
          
          {/* Refresh Message */}
          {refreshMessage && (
            <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
              refreshMessage.startsWith('✅') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {refreshMessage}
            </div>
          )}
        </div>

        {/* Content Section */}
        {activeTab === 'schemes' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Government Schemes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore various government initiatives designed to support farmers with financial assistance, 
                insurance, technology, and sustainable farming practices.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSchemes.map((scheme, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                  onClick={() => handleLinkClick(scheme.link)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                        {scheme.category}
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {scheme.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {scheme.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-green-600 font-medium text-sm">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ngos' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">NGOs & Organizations</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Connect with non-governmental organizations and foundations working towards 
                farmer welfare, rural development, and sustainable agriculture.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNgos.map((ngo, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                  onClick={() => handleLinkClick(ngo.link)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                        {ngo.focus}
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {ngo.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {ngo.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                      Visit Website
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Impact Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{allSchemes.length}</div>
              <div className="text-gray-600">Government Schemes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{allNgos.length}</div>
              <div className="text-gray-600">Partner NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">100K+</div>
              <div className="text-gray-600">Farmers Benefited</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹50Cr+</div>
              <div className="text-gray-600">Total Support Provided</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
