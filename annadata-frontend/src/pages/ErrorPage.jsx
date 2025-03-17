import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  // Default error values
  let status = 'Error';
  let message = 'An unexpected error has occurred.';

  // Try to extract more specific error information if available
  if (error) {
    if (error.status === 404) {
      status = '404';
      message = 'Page not found';
    } else if (error.status) {
      status = error.status;
      message = error.statusText || message;
    } else if (error.message) {
      message = error.message;
    }
  }

  return (
    <div className="error-page text-center my-5">
      <div className="mb-4">
        <span className="display-1 text-danger">{status}</span>
      </div>
      <h2 className="mb-4">{message}</h2>
      <p className="mb-4 text-muted">
        {error?.data?.message || 'Something went wrong. Please try again later.'}
      </p>
      <Link to="/" className="btn btn-success">
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
