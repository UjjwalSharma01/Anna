import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    land_area: '',
    income: ''
  });

  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || '',
        email: user.email || '',
        location: user.location || '',
        land_area: user.land_area || '',
        income: user.income || ''
      };
      setProfileData(userData);
      setFormData(userData);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // TODO: Implement API call to update profile
    console.log('Saving profile data:', formData);
    setProfileData(formData);
    setIsEditing(false);
    // Show success message
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profile Data</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* User Avatar SVG */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <svg 
                    width="60" 
                    height="60" 
                    viewBox="-54.58 0 337.122 337.122" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600"
                  >
                    <defs>
                      <style>
                        {`.a{fill:#ffffff;}.b{fill:#211715;}.c{fill:#ffda71;}.d{fill:#85807f;}.e{fill:none;}.f{fill:#74c66d;}.g{fill:#febe69;}.h{fill:#f2635f;}.i{fill:#ad7b59;}.j{fill:#acdda7;}`}
                      </style>
                    </defs>
                    <path className="c" d="M150.33,131.68c18.254-2.851,32.911-5.57,48.33-16.214,7.359-5.081,14.7-15.32,14.7-23.656,0-9.392-2.813-18.535-10.959-26.4a82.832,82.832,0,0,0-28.247-17.727c-.73-2.264-1.281-3.979-1.281-3.979-2.325-6.58-9.242-19.7-20.11-28.7-9.048-7.487-26.172-13.18-39.33-12.564C100.274,1.828,83.146,7.522,74.1,15.01,63.229,24,56.312,37.128,53.986,43.708l-1.68,4.143A82.525,82.525,0,0,0,24.458,65.414c-8.145,7.861-11.3,16.592-11.3,25.985,0,8.335,7.68,18.986,15.04,24.067C43.62,126.11,58.277,128.829,76.531,131.68"/>
                    <path className="b" d="M89.524,90.876c-.754,2.452-.262,8.092,4.383,8.573,6.139-.037,6.466-6.857,4.4-10.063C96.614,86.761,91.638,85.669,89.524,90.876Z"/>
                    <path className="b" d="M138.69,90.876c.754,2.452.263,8.093-4.382,8.573-6.14-.037-6.467-6.857-4.4-10.063C131.6,86.761,136.575,85.669,138.69,90.876Z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">User Profile</h1>
                  <p className="text-green-100">Manage your account information</p>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land Area (acres)
                    </label>
                    <input
                      type="text"
                      name="land_area"
                      value={formData.land_area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your land area"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income
                    </label>
                    <input
                      type="text"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your annual income"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Username
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData?.username || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Email
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData?.email || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Location
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData?.location || 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Land Area
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData?.land_area ? `${profileData.land_area} acres` : 'Not provided'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Annual Income
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData?.income || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-white text-green-600 py-3 px-4 rounded-lg border border-green-200 hover:bg-green-50 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Update Password</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-white text-green-600 py-3 px-4 rounded-lg border border-green-200 hover:bg-green-50 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
