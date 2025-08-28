import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import schemesService from '../services/schemesService';

const Schemes = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schemes');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Government Schemes Data
  const allSchemes = [
    { 
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Financial support of ₹6,000 per year to small and marginal farmers',
      category: 'Financial Support',
      eligibility: 'Small & Marginal Farmers',
      amount: '₹6,000/year'
    },
    { 
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', 
      link: 'https://www.youtube.com/watch?v=kAlNM6G6cC4',
      description: 'Crop insurance scheme to protect farmers from crop losses',
      category: 'Insurance',
      eligibility: 'All Farmers',
      amount: 'Premium Subsidized'
    },
    { 
      name: 'National Mission for Sustainable Agriculture (NMSA)', 
      link: 'https://www.youtube.com/watch?v=SFKz_aEFfZw',
      description: 'Promoting sustainable agricultural practices and climate resilience',
      category: 'Sustainability',
      eligibility: 'All Farmers',
      amount: 'Variable Support'
    },
    { 
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)', 
      link: 'https://www.youtube.com/watch?v=_JTaN927MKc',
      description: 'Promoting organic farming through cluster-based approach',
      category: 'Organic Farming',
      eligibility: 'Organic Farmers',
      amount: '₹50,000/hectare'
    },
    { 
      name: 'Soil Health Card Scheme', 
      link: 'https://www.youtube.com/watch?v=ViYTVlOA1FY',
      description: 'Providing soil health information to farmers for better crop management',
      category: 'Soil Health',
      eligibility: 'All Farmers',
      amount: 'Free Service'
    },
    { 
      name: 'Rashtriya Krishi Vikas Yojana (RKVY)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'State plan scheme for agricultural and allied sector development',
      category: 'Development',
      eligibility: 'All Farmers',
      amount: 'State Specific'
    },
    { 
      name: 'National Livestock Mission (NLM)', 
      link: 'https://youtu.be/jGMnxpLjQ4s?si=uSqIPJ_xkuu0ezfp',
      description: 'Sustainable development of livestock sector',
      category: 'Livestock',
      eligibility: 'Livestock Farmers',
      amount: 'Variable Support'
    },
    { 
      name: 'National Beekeeping and Honey Mission (NBHM)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Promoting beekeeping and honey production',
      category: 'Apiculture',
      eligibility: 'Beekeepers',
      amount: 'Up to ₹5 Lakh'
    },
    { 
      name: 'Animal Husbandry Infrastructure Development Fund (AHIDF)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Infrastructure development for animal husbandry sector',
      category: 'Infrastructure',
      eligibility: 'Livestock Entrepreneurs',
      amount: 'Up to ₹25 Crore'
    },
    { 
      name: 'Kisan Credit Card (KCC)', 
      link: 'https://www.youtube.com/watch?v=beOsC0dhncc',
      description: 'Credit facility for agricultural and allied activities',
      category: 'Credit',
      eligibility: 'All Farmers',
      amount: 'Based on Land Holding'
    }
  ];

  // NGOs Data
  const allNgos = [
    { 
      name: 'Aahwahan', 
      link: 'https://www.aahwahan.com/',
      description: 'Working towards rural development and farmer empowerment',
      focus: 'Rural Development',
      location: 'Pan India',
      established: '2010'
    },
    { 
      name: 'End Poverty', 
      link: 'https://www.endpoverty.org.in/',
      description: 'Focused on poverty alleviation through sustainable agriculture',
      focus: 'Poverty Alleviation',
      location: 'Maharashtra',
      established: '2015'
    },
    { 
      name: 'Swades Foundation', 
      link: 'https://swadesfoundation.org/',
      description: 'Rural development through community participation',
      focus: 'Community Development',
      location: 'Maharashtra',
      established: '2009'
    },
    { 
      name: 'Universal Versatile Society', 
      link: 'https://uvsociety.org/home',
      description: 'Promoting sustainable farming practices and rural development',
      focus: 'Sustainable Farming',
      location: 'Rajasthan',
      established: '2012'
    },
    { 
      name: 'Dilasa', 
      link: 'https://dilasa.org/',
      description: 'Supporting farmers through technology and innovation',
      focus: 'Technology & Innovation',
      location: 'Karnataka',
      established: '2008'
    },
    { 
      name: 'Watershed Organization Trust', 
      link: 'https://wotr.org/',
      description: 'Watershed development and climate resilience',
      focus: 'Water Conservation',
      location: 'Maharashtra',
      established: '1993'
    },
    { 
      name: 'Vrutti', 
      link: 'https://vruttiimpactcatalysts.org/vrutti/',
      description: 'Sustainable livelihood solutions for farmers',
      focus: 'Livelihood',
      location: 'Karnataka',
      established: '2002'
    },
    { 
      name: 'BAIF Development Research Foundation', 
      link: 'https://www.baif.org.in/',
      description: 'Research and development for rural communities',
      focus: 'Research & Development',
      location: 'Maharashtra',
      established: '1967'
    },
    { 
      name: 'Nav Bharat Jagriti Kendra (NBJK)', 
      link: 'https://www.nbjk.org/',
      description: 'Rural awakening and development initiatives',
      focus: 'Rural Awakening',
      location: 'Uttar Pradesh',
      established: '1985'
    }
  ];

  const categories = ['all', ...new Set(allSchemes.map(scheme => scheme.category))];
  const ngoFocuses = ['all', ...new Set(allNgos.map(ngo => ngo.focus))];

  const filteredSchemes = allSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredNgos = allNgos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFocus = selectedCategory === 'all' || ngo.focus === selectedCategory;
    return matchesSearch && matchesFocus;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 via-primary-700/90 to-accent-600/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Government Schemes & 
              <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Support Organizations
              </span>
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover comprehensive resources, financial support, and expert assistance to accelerate your agricultural journey
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{allSchemes.length}</div>
                <div className="text-primary-200 text-sm">Government Schemes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">{allNgos.length}</div>
                <div className="text-primary-200 text-sm">Partner NGOs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-primary-200 text-sm">Farmers Benefited</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">₹50Cr+</div>
                <div className="text-primary-200 text-sm">Support Provided</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-primary-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search schemes or organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {activeTab === 'schemes' 
                  ? categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))
                  : ngoFocuses.slice(1).map(focus => (
                      <option key={focus} value={focus}>{focus}</option>
                    ))
                }
              </select>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                refreshing 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
          
          {/* Refresh Message */}
          {refreshMessage && (
            <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
              refreshMessage.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {refreshMessage}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-xl border border-primary-100">
            <button
              onClick={() => {
                setActiveTab('schemes');
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'schemes'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Government Schemes
            </button>
            <button
              onClick={() => {
                setActiveTab('ngos');
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'ngos'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2c0 1.11-.89 2-2 2s-2-.89-2-2zM4 18v-4h2v2h2v2H4zM22 8v2h-8v-2h8zm-8 4v2h8v-2h-8zM4 8v2h8V8H4zm0 4v2h8v-2H4z"/>
              </svg>
              NGOs & Organizations
            </button>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'schemes' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Government Schemes</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore comprehensive government initiatives designed to support farmers with financial assistance, 
                insurance, technology, and sustainable farming practices.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredSchemes.length} of {allSchemes.length} schemes
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredSchemes.map((scheme, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
                  onClick={() => handleLinkClick(scheme.link)}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <span className="inline-block bg-gradient-to-r from-primary-100 to-accent-100 text-primary-800 text-xs font-semibold px-4 py-2 rounded-full">
                        {scheme.category}
                      </span>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {scheme.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {scheme.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500">Eligibility:</span>
                        <span className="text-sm font-semibold text-gray-700">{scheme.eligibility}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500">Amount:</span>
                        <span className="text-sm font-semibold text-primary-600">{scheme.amount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                        Learn More
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSchemes.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ngos' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">NGOs & Organizations</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with non-governmental organizations and foundations working towards 
                farmer welfare, rural development, and sustainable agriculture.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredNgos.length} of {allNgos.length} organizations
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredNgos.map((ngo, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
                  onClick={() => handleLinkClick(ngo.link)}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold px-4 py-2 rounded-full">
                        {ngo.focus}
                      </span>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {ngo.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {ngo.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500">Location:</span>
                        <span className="text-sm font-semibold text-gray-700">{ngo.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500">Established:</span>
                        <span className="text-sm font-semibold text-blue-600">{ngo.established}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                        Visit Website
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2c0 1.11-.89 2-2 2s-2-.89-2-2zM4 18v-4h2v2h2v2H4zM22 8v2h-8v-2h8zm-8 4v2h8v-2h-8zM4 8v2h8V8H4zm0 4v2h8v-2H4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredNgos.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No organizations found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Statistics Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-3xl shadow-2xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">Impact & Reach</h3>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                Our platform connects farmers with comprehensive support systems to drive agricultural growth
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-2">{allSchemes.length}</div>
                <div className="text-primary-200">Government Schemes</div>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2c0 1.11-.89 2-2 2s-2-.89-2-2zM4 18v-4h2v2h2v2H4zM22 8v2h-8v-2h8zm-8 4v2h8v-2h-8zM4 8v2h8V8H4zm0 4v2h8v-2H4z"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-2">{allNgos.length}</div>
                <div className="text-primary-200">Partner NGOs</div>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-2">100K+</div>
                <div className="text-primary-200">Farmers Benefited</div>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-2">₹50Cr+</div>
                <div className="text-primary-200">Support Provided</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
