import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getQuestionById, answerQuestion, upvoteQuestion, upvoteAnswer } from '../services/forumService.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFlash } from '../context/FlashContext.jsx';

const QuestionDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addFlash } = useFlash();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await getQuestionById(id);
        setQuestion(data);
      } catch (error) {
        addFlash(error.message || 'Failed to load question details', 'danger');
        navigate('/forum');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, addFlash, navigate]);

  const handleUpvoteQuestion = async () => {
    if (!isAuthenticated) {
      return addFlash('You must be logged in to upvote', 'warning');
    }

    try {
      const response = await upvoteQuestion(id);
      setQuestion(prev => ({ ...prev, upvotes: response.upvotes }));
    } catch (error) {
      addFlash(error.message || 'Failed to upvote question', 'danger');
    }
  };

  const handleUpvoteAnswer = async (answerId) => {
    if (!isAuthenticated) {
      return addFlash('You must be logged in to upvote', 'warning');
    }

    try {
      const response = await upvoteAnswer(id, answerId);
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(ans => 
          ans._id === answerId ? { ...ans, upvotes: response.upvotes } : ans
        )
      }));
    } catch (error) {
      addFlash(error.message || 'Failed to upvote answer', 'danger');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!answerText.trim()) {
      return addFlash('Answer cannot be empty', 'warning');
    }
    
    setSubmitting(true);
    
    try {
      const response = await answerQuestion(id, { content: answerText });
      setQuestion(prev => ({
        ...prev,
        answers: [...(prev.answers || []), response]
      }));
      setAnswerText('');
      addFlash('Your answer has been posted', 'success');
    } catch (error) {
      addFlash(error.message || 'Failed to post your answer', 'danger');
    } finally {
      setSubmitting(false);
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

  if (!question) {
    return <div className="alert alert-danger">Question not found</div>;
  }

  return (
    <div className="question-detail-page">
      <div className="mb-4">
        <Link to="/forum" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Forum
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title mb-3">{question.title}</h1>
          
          <div className="d-flex justify-content-between mb-3">
            <span className="text-muted">
              Asked by {question.author?.username || 'Anonymous'} on {new Date(question.createdAt).toLocaleDateString()}
            </span>
            
            <div>
              <button 
                className="btn btn-sm btn-outline-success me-2"
                onClick={handleUpvoteQuestion}
                disabled={!isAuthenticated}
              >
                <i className="bi bi-hand-thumbs-up"></i> {question.upvotes || 0}
              </button>
              
              {question.tags && question.tags.length > 0 && (
                <span>
                  {question.tags.map(tag => (
                    <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                  ))}
                </span>
              )}
            </div>
          </div>
          
          <div className="question-content mb-4">
            <p className="card-text">{question.content}</p>
          </div>
        </div>
      </div>

      <h3 className="mb-3">
        {question.answers && question.answers.length > 0 ? (
          `${question.answers.length} ${question.answers.length === 1 ? 'Answer' : 'Answers'}`
        ) : (
          'No answers yet'
        )}
      </h3>

      {question.answers && question.answers.map((answer, index) => (
        <div key={answer._id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">
                By {answer.author?.username || 'Anonymous'} on {new Date(answer.createdAt).toLocaleDateString()}
              </span>
              <button 
                className="btn btn-sm btn-outline-success"
                onClick={() => handleUpvoteAnswer(answer._id)}
                disabled={!isAuthenticated}
              >
                <i className="bi bi-hand-thumbs-up"></i> {answer.upvotes || 0}
              </button>
            </div>
            <p className="card-text">{answer.content}</p>
          </div>
        </div>
      ))}

      {isAuthenticated ? (
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title mb-3">Your Answer</h4>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="4"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Share your knowledge or experience..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Posting...
                  </>
                ) : (
                  'Post Your Answer'
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="alert alert-info mt-4">
          <Link to="/login" className="alert-link">Login</Link> or <Link to="/login" className="alert-link">register</Link> to answer this question.
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
