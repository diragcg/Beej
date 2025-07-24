// Seed Inspection page for the Beej application

import React, { useState, useEffect } from 'react';
import { seedService } from '../services/seedService';

const SeedInspection = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch seed inspection reports from Supabase
    const fetchInspections = async () => {
      try {
        setLoading(true);
        const data = await seedService.getSeedInspectionReports();
        setInspections(data);
      } catch (err) {
        console.error('Error fetching inspection data:', err);
        setError('डेटा लोड करने में त्रुटि हुई');
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, []);

  return (
    <div className="seed-inspection-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">बीज निरीक्षण रिपोर्ट</h1>
        <button className="btn btn-primary">
          नई निरीक्षण रिपोर्ट
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">लोड हो रहा है...</span>
          </div>
          <p className="mt-2">डेटा लोड हो रहा है...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>निरीक्षण दिनांक</th>
                    <th>जिला का नाम</th>
                    <th>कुल बीज विक्रय केन्द्र</th>
                    <th>बीज निरीक्षक/अधिकारी</th>
                    <th>रिमार्क</th>
                    <th>कार्य</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.length > 0 ? (
                    inspections.map((inspection, index) => (
                      <tr key={inspection.id}>
                        <td>{index + 1}</td>
                        <td>{inspection['निरीक्षण दिनांक']}</td>
                        <td>{inspection['जिला का नाम']}</td>
                        <td>{inspection['कुल बीज विक्रय केन्द्रो']}</td>
                        <td>{inspection['बीज निरीक्षक/अधिकारी का']}</td>
                        <td>{inspection['रिमार्क']}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-info"
                              title="देखें"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-warning"
                              title="संपादित करें"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              title="हटाएं"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        कोई निरीक्षण रिपोर्ट नहीं मिली
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Inspection Modal would go here */}
      {/* Edit Inspection Modal would go here */}
      {/* Delete Confirmation Modal would go here */}
    </div>
  );
};

export default SeedInspection;
