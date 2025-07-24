// Reports page for the Beej application

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const Reports = () => {
  const [reportType, setReportType] = useState('inspection');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch districts from the database
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('districts')
          .select('id, district_name')
          .order('district_name', { ascending: true });
        
        if (error) throw error;
        
        setDistricts(data || []);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError('जिलों की जानकारी लोड करने में त्रुटि हुई');
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      // In a real implementation, this would call an API to generate the report
      // For example:
      // const { data, error } = await supabase.rpc('generate_report', {
      //   report_type: reportType,
      //   district_id: district || null,
      //   start_date: dateRange.startDate || null,
      //   end_date: dateRange.endDate || null
      // });
      
      // if (error) throw error;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('रिपोर्ट तैयार की जा रही है। कृपया डाउनलोड करें।');
    } catch (err) {
      console.error('Error generating report:', err);
      setError('रिपोर्ट जनरेट करने में त्रुटि हुई');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="reports-container">
      <h1 className="h2 mb-4">रिपोर्ट जनरेटर</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="reportType" className="form-label">रिपोर्ट का प्रकार</label>
              <select
                id="reportType"
                className="form-select"
                value={reportType}
                onChange={handleReportTypeChange}
              >
                <option value="inspection">निरीक्षण रिपोर्ट</option>
                <option value="samples">नमूना रिपोर्ट</option>
                <option value="complaints">शिकायत रिपोर्ट</option>
                <option value="summary">सारांश रिपोर्ट</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="district" className="form-label">जिला</label>
              <select
                id="district"
                className="form-select"
                value={district}
                onChange={handleDistrictChange}
                disabled={loading}
              >
                <option value="">सभी जिले</option>
                {districts.map(dist => (
                  <option key={dist.id} value={dist.id}>
                    {dist.district_name}
                  </option>
                ))}
              </select>
              {loading && (
                <div className="spinner-border spinner-border-sm text-primary mt-2" role="status">
                  <span className="visually-hidden">लोड हो रहा है...</span>
                </div>
              )}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="startDate" className="form-label">आरंभ दिनांक</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="endDate" className="form-label">अंतिम दिनांक</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={generateReport}
            disabled={generating}
          >
            {generating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                रिपोर्ट तैयार हो रही है...
              </>
            ) : 'रिपोर्ट जनरेट करें'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">हाल की रिपोर्ट</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>रिपोर्ट का नाम</th>
                  <th>प्रकार</th>
                  <th>जिला</th>
                  <th>दिनांक</th>
                  <th>जनरेट किया गया</th>
                  <th>कार्य</th>
                </tr>
              </thead>
              <tbody>
                {/* In a real implementation, this would be populated from the database */}
                <tr>
                  <td colSpan="6" className="text-center">
                    कोई रिपोर्ट उपलब्ध नहीं है
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
