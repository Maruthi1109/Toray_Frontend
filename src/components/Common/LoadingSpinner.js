import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <style>
        {`
          .loading-spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
          }
          
          .spinner-border {
            width: 3rem;
            height: 3rem;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner; 