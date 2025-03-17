import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { askQuestion } from '../services/forumService';
import { useFlash } from '../context/FlashContext';

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const { addFlash } = useFlash();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return addFlash('Title and content are required', 'danger');
    }

    // Convert comma-separated tags to array
    const tagsArray = formData.tags 
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) 
      : [];

    setLoading(true);

    try {
      const response = await askQuestion({ 
        ...formData,
        tags: tagsArray
      });
      addFlash('Question posted successfully!', 'success');
      navigate(`/forum/${response._id}`);
    } catch (error) {
      addFlash(error.message || 'Failed to post question', 'danger');
      setLoading(false);
    }
  };

  return (
    <div className="ask-question-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Ask a Question</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Question Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. How to prevent pests in organic farming?"
                required
              />
              <div className="form-text text-muted">
                Be specific and concise with your question
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">Question Details</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="Provide as much detail as possible to help others understand your question."
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags (optional)</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. organic, pests, farming (comma separated)"
              />
              <div className="form-text text-muted">
                Add up to 5 tags to categorize your question
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Posting...
                  </>
                ) : (
                  'Post Your Question'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;