import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats] = useState({
    farmers: 1250,
    posts: 3400,
    schemes: 45
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      title: 'Submit Farm Data',
      description: 'Record your latest agricultural data',
      icon: '📝',
      route: ROUTES.ANNADATA,
      color: 'green'
    },
    {
      title: 'Ask Community',
      description: 'Get help from fellow farmers',
      icon: '❓',
      route: ROUTES.FORUM,
      color: 'blue'
    },
    {
      title: 'Browse Schemes',
      description: 'Find government subsidies',
      icon: '🔍',
      route: ROUTES.SCHEMES,
      color: 'yellow'
    },
    {
      title: 'View Profile',
      description: 'Manage your account',
      icon: '👤',
      route: ROUTES.PROFILE,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to</span>{' '}
                  <span className="block text-green-600 xl:inline">Anna</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your comprehensive platform for agricultural data management, 
                  farmer community discussions, and government scheme information.
                </p>
                
                {isAuthenticated ? (
                  <div className="mt-8">
                    {/* Personalized Greeting */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {getGreeting()}, {user?.username || user?.name || 'Farmer'}! 👋
                      </h2>
                      <p className="text-gray-600 mb-2">
                        Ready to explore agricultural data and connect with the farming community?
                      </p>
                      <p className="text-sm text-gray-500">
                        Last login: {currentTime.toLocaleDateString()} • Status: Active
                      </p>
                    </div>
                    
                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => (
                        <Link
                          key={index}
                          to={action.route}
                          className={`bg-white hover:bg-${action.color}-50 border border-${action.color}-200 rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105`}
                        >
                          <div className="text-3xl mb-2">{action.icon}</div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow-lg">
                      <Link
                        to={ROUTES.SIGNUP}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:shadow-lg hover:scale-105"
                      >
                        🚀 Get Started
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to={ROUTES.LOGIN}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:shadow-lg"
                      >
                        🔑 Sign In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
        
        {/* Enhanced Decorative Section */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-green-400 via-green-500 to-blue-500 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 text-6xl">🌾</div>
              <div className="absolute top-32 right-20 text-4xl">🚜</div>
              <div className="absolute bottom-20 left-16 text-5xl">🌱</div>
              <div className="absolute bottom-32 right-10 text-3xl">☀️</div>
            </div>
            
            <div className="text-center text-white z-10">
              <div className="text-8xl mb-4 animate-bounce">🌾</div>
              <h3 className="text-2xl font-bold mb-2">Digital Agriculture</h3>
              <p className="text-lg opacity-90 mb-4">Empowering Farmers with Technology</p>
              
              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.farmers}+</div>
                  <div className="text-sm opacity-80">Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.posts}+</div>
                  <div className="text-sm opacity-80">Forum Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.schemes}</div>
                  <div className="text-sm opacity-80">Schemes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for modern farming
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Discover powerful tools designed specifically for today's farmers
            </p>
          </div>

          <div className="mt-12">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Anna Data Feature */}
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">Agricultural Data</h3>
                <p className="text-base text-gray-600 mb-4">
                  Manage and analyze your farm data with our comprehensive data management system.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  ✓ Data Analytics • ✓ Crop Tracking • ✓ Yield Reports
                </div>
              </div>

              {/* Forum Feature */}
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💬</div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">Community Forum</h3>
                <p className="text-base text-gray-600 mb-4">
                  Connect with fellow farmers, share experiences, and get advice from the community.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  ✓ Expert Advice • ✓ Q&A Support • ✓ Local Network
                </div>
              </div>

              {/* Schemes Feature */}
              <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-3">Government Schemes</h3>
                <p className="text-base text-gray-600 mb-4">
                  Stay updated with the latest government schemes and subsidies for farmers.
                </p>
                <div className="text-sm text-yellow-600 font-medium">
                  ✓ Live Updates • ✓ Easy Applications • ✓ Subsidy Tracker
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Row */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌡️', title: 'Weather Updates', desc: 'Real-time weather data' },
              { icon: '💰', title: 'Market Prices', desc: 'Live commodity prices' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Access anywhere' },
              { icon: '🔒', title: 'Secure Data', desc: 'Your data is safe' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Call to Action Section */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-4xl">🌾</div>
            <div className="absolute top-16 right-8 text-3xl">🚜</div>
            <div className="absolute bottom-8 left-12 text-5xl">🌱</div>
            <div className="absolute bottom-16 right-4 text-2xl">☀️</div>
          </div>
          
          <div className="relative max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Join Anna today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-green-100">
              Join thousands of farmers who are already using Anna to manage their agricultural data and connect with the community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.SIGNUP}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                🚀 Sign up for free
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                🔑 Already have account?
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
