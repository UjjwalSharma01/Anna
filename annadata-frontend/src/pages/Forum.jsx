import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Use the enhanced forum bridge instead of serviceHelper directly
import { getQuestions, upvoteQuestion } from '../utils/forumBridge';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { isAuthenticated } = useAuth();
  const { addFlash } = useFlash();
  const navigate = useNavigate();
  
  const pageSize = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log('Fetching forum questions, page:', currentPage);
        
        // Use the forum bridge getQuestions which includes locally created questions
        const response = await getQuestions(currentPage, pageSize);
        console.log('Got forum response:', response);
        
        // Handle the response - be extra careful about structure
        if (!response) {
          // No response at all
          console.warn('No response received from getQuestions');
          setQuestions([]);
          setTotalPages(1);
          return;
        }
        
        if (Array.isArray(response)) {
          // Direct array of questions
          console.log('Response is an array of questions');
          setQuestions(response);
          setTotalPages(1);
        } 
        else if (response.questions && Array.isArray(response.questions)) {
          // Object with questions array
          console.log('Response has questions array property');
          setQuestions(response.questions);
          setTotalPages(response.totalPages || 1);
        }
        else {
          // Unexpected format - try to handle anything
          console.warn('Unexpected response format - attempting to handle');
          let extractedQuestions = [];
          
          // Try several ways to extract questions
          if (typeof response === 'object') {
            if (Object.keys(response).length > 0) {
              // Try to find an array property that might be questions
              const arrayProps = Object.values(response).filter(val => Array.isArray(val));
              if (arrayProps.length > 0) {
                extractedQuestions = arrayProps[0];
              } else {
                // Last resort - treat the object itself as a question
                extractedQuestions = [response];
              }
            }
          }
          
          setQuestions(extractedQuestions);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Final forum fetch error:', error);
        // Don't show an error message - just use empty state
        setQuestions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    
    // Reset the refresh flag
    if (typeof window !== 'undefined') {
      window.__FORUM_QUESTIONS_NEED_REFRESH = false;
    }
  }, [currentPage, addFlash, pageSize]);

  const handleUpvote = async (questionId, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      addFlash('You must be logged in to upvote questions', 'warning');
      return;
    }

    try {
      // Use the direct upvoteQuestion function from forumBridge
      const response = await upvoteQuestion(questionId);
      
      // Update the question with new upvote count
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q._id === questionId ? { ...q, upvotes: response.upvotes } : q
        )
      );
    } catch (error) {
      addFlash(error.message || 'Failed to upvote question', 'danger');
    }
  };

  // Handle sorting by date, upvotes, or answers count
  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'popular') {
      return b.upvotes - a.upvotes;
    } else if (sortBy === 'answers') {
      return (b.answers?.length || 0) - (a.answers?.length || 0);
    }
    return 0;
  });

  // Filter questions by title or content
  const filteredQuestions = sortedQuestions.filter(
    q => q.title.toLowerCase().includes(filter.toLowerCase()) || 
         q.content.toLowerCase().includes(filter.toLowerCase())
  );

  // Handle page change
  const goToPage = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  if (loading && questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Farmers' Forum</h1>
        <Link
          to="/forum/ask"
          className="btn btn-success"
        >
          Ask a Question
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search questions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Upvoted</option>
            <option value="answers">Most Answered</option>
          </select>
        </div>
      </div>

      {filteredQuestions.length > 0 ? (
        <div className="list-group mb-4">
          {filteredQuestions.map((question) => (
            <div 
              key={question._id}
              className="list-group-item list-group-item-action"
              onClick={() => navigate(`/forum/${question._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{question.title}</h5>
                <small className="text-muted">
                  {new Date(question.createdAt).toLocaleDateString()}
                </small>
              </div>
              <p className="mb-1">
                {question.content.length > 200 
                  ? `${question.content.substring(0, 200)}...` 
                  : question.content}
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  By {question.author?.username || 'Anonymous'}
                </small>
                <div>
                  <button 
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={(e) => handleUpvote(question._id, e)}
                  >
                    <i className="bi bi-hand-thumbs-up"></i> {question.upvotes || 0}
                  </button>
                  <span className="badge bg-secondary">
                    <i className="bi bi-chat-dots"></i> {question.answers?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          No questions found. {isAuthenticated ? 'Be the first to ask!' : 'Login to ask a question.'}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Forum pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {[...Array(totalPages).keys()].map(page => (
              <li 
                key={page + 1} 
                className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
              >
                <button 
                  className="page-link" 
                  onClick={() => goToPage(page + 1)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Forum;