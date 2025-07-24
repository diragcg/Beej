// Dashboard page for the Beej application

import React, { useState, useEffect } from 'react';
import Card3D from '../components/common/Card3D';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSamples: 0,
    pendingInspections: 0,
    nonStandardSamples: 0,
    totalDistricts: 0
  });

  useEffect(() => {
    // This would normally fetch data from Supabase
    // For now, we'll use placeholder data
    setStats({
      totalSamples: 128,
      pendingInspections: 23,
      nonStandardSamples: 7,
      totalDistricts: 28
    });
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="h2 mb-4">डैशबोर्ड</h1>
      
      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4">
          <Card3D 
            title="कुल नमूने" 
            value={stats.totalSamples} 
            color="#4caf50" 
          />
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <Card3D 
            title="लंबित निरीक्षण" 
            value={stats.pendingInspections} 
            color="#ff9800" 
          />
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <Card3D 
            title="अमानक नमूने" 
            value={stats.nonStandardSamples} 
            color="#f44336" 
          />
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <Card3D 
            title="कुल जिले" 
            value={stats.totalDistricts} 
            color="#2196f3" 
          />
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">हाल के निरीक्षण</h5>
            </div>
            <div className="card-body">
              <p>हाल के निरीक्षण यहां दिखाई देंगे</p>
              {/* Table would go here */}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">जिलेवार सारांश</h5>
            </div>
            <div className="card-body">
              <p>जिलेवार आंकड़े यहां दिखाई देंगे</p>
              {/* Chart would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
