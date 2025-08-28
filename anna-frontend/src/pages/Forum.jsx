import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import forumService from '../services/forumService';

const Forum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 6;

  // Debug: Test API connection on component mount
  useEffect(() => {
    console.log('🚀 Forum component mounted - starting debug tests');
    console.log('🌐 API Base URL from constants:', process.env.REACT_APP_API_URL || 'http://localhost:5050');
    testDirectAPICall();
  }, []);

  const testDirectAPICall = async () => {
    try {
      console.log('🧪 Testing direct API call...');
      const response = await fetch('http://localhost:5050/api/forum');
      const data = await response.json();
      console.log('✅ Direct API call successful:', data);
    } catch (error) {
      console.error('❌ Direct API call failed:', error);
    }
  };

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  // Refresh posts when component becomes visible (e.g., when navigating back from Ask page)
  useEffect(() => {
    const handleFocus = () => {
      // Refresh posts when the window gets focus (user returns to tab)
      fetchPosts();
    };

    const handleVisibilityChange = () => {
      // Refresh posts when page becomes visible
      if (!document.hidden) {
        fetchPosts();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      console.log('🔄 Fetching posts - Page:', pageNum, 'Append:', append);
      
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const response = await forumService.getAllPosts();
      console.log('📥 Forum API Response:', response);
      
      if (response.success) {
        const allPosts = response.data;
        console.log('📝 Total posts from API:', allPosts.length);
        
        const startIndex = (pageNum - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedPosts = allPosts.slice(startIndex, endIndex);
        
        console.log('📄 Paginated posts:', paginatedPosts.length, 'Start:', startIndex, 'End:', endIndex);
        
        if (append) {
          setPosts(prevPosts => {
            const newPosts = [...prevPosts, ...paginatedPosts];
            console.log('➕ Appending posts - Total now:', newPosts.length);
            return newPosts;
          });
        } else {
          console.log('🔄 Setting initial posts:', paginatedPosts.length);
          setPosts(paginatedPosts);
        }
        
        // Check if there are more posts to load
        setHasMore(endIndex < allPosts.length);
        console.log('🔚 Has more posts:', endIndex < allPosts.length);
      } else {
        console.error('❌ API Error:', response.message);
        setError(response.message || 'Failed to fetch forum posts');
      }
    } catch (err) {
      console.error('💥 Error fetching posts:', err);
      setError(err.message || 'Failed to fetch forum posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const refreshPosts = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts();
  };

  const handlePostQuestion = () => {
    navigate('/ask');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🌾 Community Forum</h1>
            <p className="text-gray-600">Share knowledge and get help from fellow farmers</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refreshPosts}
              disabled={loading}
              className="bg-white text-green-600 border-2 border-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </div>
              ) : (
                <>🔄 Refresh</>
              )}
            </button>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Have something to ask?</p>
              <button
                onClick={handlePostQuestion}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                📝 Post a Question
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{posts.length}</h3>
                <p className="text-gray-600">Active Posts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">150+</h3>
                <p className="text-gray-600">Community Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">95%</h3>
                <p className="text-gray-600">Questions Answered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const { date, time } = formatDate(post.createdAt);
            return (
              <div key={post._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-sm">
                            {post.author.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{post.author.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {post.Category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.Question}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {truncateText(post.Description)}
                  </p>
                  <button className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted on {date} at {time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Be the first to start a discussion in our community!</p>
            <button
              onClick={handlePostQuestion}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              Post Your First Question
            </button>
          </div>
        )}

        {/* Load More Button */}
        {posts.length > 0 && hasMore && (
          <div className="text-center mt-12">
            <button 
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading More...
                </div>
              ) : (
                'Load More Posts'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
