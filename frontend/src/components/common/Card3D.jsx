// 3D Card component for the Beej application
// This is a placeholder that will be implemented with Three.js

import React from 'react';

const Card3D = ({ title, value, color = "#4caf50" }) => {
  return (
    <div className="card" style={{ backgroundColor: color, color: 'white' }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
        <div className="card-footer text-muted">
          <small>3D visualization will be implemented here</small>
        </div>
      </div>
    </div>
  );
};

export default Card3D;
