import React from 'react';

const CropDiseaseDetection = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="crop-disease-detection bg-light p-4 rounded shadow-sm">
      <div className="mb-4 d-flex align-items-center">
        <div className="me-3 text-success">
          <i className="bi bi-microscope fs-1"></i>
        </div>
        <h2 className="fs-1 mb-0">{data.title}</h2>
      </div>
      
      <p className="lead mb-4">{data.description}</p>
      
      <div className="mb-4">
        <h4 className="mb-3">Key Features:</h4>
        <ul className="list-group">
          {data.features.map((feature, index) => (
            <li key={index} className="list-group-item border-0 bg-transparent d-flex align-items-center">
              <i className="bi bi-check-circle-fill text-success me-2"></i>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h4 className="mb-3">Common Detectable Diseases:</h4>
        <div className="row g-3">
          {data.commonDiseases.map((disease, index) => (
            <div key={index} className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">{disease.name}</h5>
                  <div className="d-flex flex-wrap">
                    {disease.crops.map((crop, idx) => (
                      <span key={idx} className="badge bg-success me-2 mb-2">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mt-4">
        <button 
          className="btn btn-success btn-lg"
          type="button"
        >
          <i className="bi bi-camera me-2"></i> {data.actionButton}
        </button>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;
