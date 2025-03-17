import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateUserProfile, getUserProfile } from '../services/authService';
import { getUserQuestions } from '../services/forumService';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';
import { defaultAvatarImage } from '../utils/defaultImages';

const Profile = () => {
  const { user, refreshUserData } = useAuth();
  const { addFlash } = useFlash();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          location: userData.location || '',
          bio: userData.bio || '',
        });
        
        const questions = await getUserQuestions();
        setUserQuestions(questions);
      } catch (error) {
        addFlash(error.message || 'Failed to load profile data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [addFlash]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      await updateUserProfile(formData);
      await refreshUserData();
      setIsEditing(false);
      addFlash('Profile updated successfully', 'success');
    } catch (error) {
      addFlash(error.message || 'Failed to update profile', 'danger');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4 shadow fade-in">
            <div className="card-body text-center">
              <div className="mb-3">
                <img
                  src={user.avatar || defaultAvatarImage}
                  alt={user.username}
                  className="rounded-circle img-fluid shadow"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatarImage;
                  }}
                />
              </div>
              <h5 className="card-title mb-0">{user.username}</h5>
              <p className="text-muted small">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              <button
                className="btn btn-outline-success"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {isEditing ? (
            <div className="card mb-4 shadow fade-in" style={{animationDelay: '0.1s'}}>
              <div className="card-body">
                <h5 className="card-title">Edit Your Profile</h5>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <small className="form-text text-muted">Email cannot be changed</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card mb-4 shadow fade-in" style={{animationDelay: '0.1s'}}>
              <div className="card-body">
                <h5 className="card-title">About</h5>
                <hr />
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {formData.name || 'Not provided'}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {formData.email}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Location</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {formData.location || 'Not provided'}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Bio</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {formData.bio || 'No bio provided'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User's Questions */}
          <div className="card shadow fade-in" style={{animationDelay: '0.2s'}}>
            <div className="card-body">
              <h5 className="card-title mb-3">My Questions</h5>
              {userQuestions.length > 0 ? (
                <div className="list-group">
                  {userQuestions.map(question => (
                    <Link 
                      key={question._id}
                      to={`/forum/${question._id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{question.title}</h6>
                        <small>{new Date(question.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1 text-truncate">{question.content}</p>
                      <small className="text-muted">
                        {question.answers?.length || 0} answers &bull; {question.upvotes || 0} upvotes
                      </small>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">
                  You haven't asked any questions yet.{' '}
                  <Link to="/forum/ask" className="alert-link">Ask your first question</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;