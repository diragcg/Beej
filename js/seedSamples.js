/**
 * Seed Samples Module for Seed Testing Portal
 * Handles data entry, display, and filtering of seed samples
 */

// Ensure the Auth and AccessControl modules are loaded
if (typeof Auth === 'undefined' || typeof AccessControl === 'undefined') {
  alert('Auth and AccessControl modules are required. Please ensure they are loaded before this script.');
}

// Define the SeedSamples namespace
const SeedSamples = {
  /**
   * Initialize the seed samples module
   */
  init: function() {
    // Check if user is logged in and has access
    if (!Auth.currentUser || !AccessControl.hasAccess(AppConfig.TABLES.SEED_SAMPLES, 'read')) {
      // Redirect to login page if not authorized
      window.location.href = 'index.html';
      return;
    }
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load seed samples data
    this.loadSeedSamples();
  },
  
  /**
   * Setup event listeners for the seed samples module
   */
  setupEventListeners: function() {
    // Seed sample form submission
    const seedSampleForm = document.getElementById('seedSampleForm');
    if (seedSampleForm) {
      seedSampleForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
  },
  
  /**
   * Load seed samples data from Supabase
   */
  loadSeedSamples: async function() {
    const contentArea = document.getElementById('pageContent');
    
    // Show loading message
    contentArea.innerHTML = '<div class="text-center"><div class="spinner-border"></div><p>बीज नमूने लोड हो रहे हैं...</p></div>';
    
    try {
      // Fetch data from Supabase
      let query = AppConfig.supabase
        .from(AppConfig.TABLES.SEED_SAMPLES)
        .select('*')
        .order('id', { ascending: false }); // Order by ID descending
      
      // Filter data based on user's access
      const filteredData = AccessControl.filterDataByAccess(await query, 'जिला');
      
      // Check if data is an object or an array and extract the data property accordingly
      const seedSamples = Array.isArray(filteredData) ? filteredData : filteredData.data;
      
      // Render the seed samples table
      this.renderSeedSamplesTable(seedSamples);
    } catch (error) {
      console.error('Error loading seed samples:', error);
      contentArea.innerHTML = `<div class="alert alert-danger">त्रुटि: बीज नमूने लोड नहीं हो पाए।</div>`;
    }
  },
  
  /**
   * Render seed samples table
   * @param {Array} seedSamples - Array of seed sample objects
   */
  renderSeedSamplesTable: function(seedSamples) {
    const contentArea = document.getElementById('pageContent');
    
    let tableHTML = `
      <div class="container mt-4">
        <h1 class="mb-4">बीज नमूने</h1>
        
        <!-- Data Entry Form -->
        <div class="card mb-4">
          <div class="card-header">नया बीज नमूना जोड़ें</div>
          <div class="card-body">
            <form id="seedSampleForm">
              <div class="mb-3">
                <label for="district" class="form-label">जिला</label>
                <select class="form-select" id="district" required>
                  <option value="">-- जिला चुनें --</option>`;
    
    // Add district options based on user's role
    if (Auth.currentUser.role === AppConfig.USER_ROLES.STATE_ADMIN) {
      // State admin sees all districts
      tableHTML += `
        <option value="रायपुर">रायपुर</option>
        <option value="दुर्ग">दुर्ग</option>
        <option value="बिलासपुर">बिलासपुर</option>
        <!-- Add other districts here -->
      `;
    } else if (Auth.currentUser.role === AppConfig.USER_ROLES.DISTRICT_OFFICER && Auth.currentUser.district) {
      // District officer sees only their district
      tableHTML += `<option value="${Auth.currentUser.district}" selected>${Auth.currentUser.district}</option>`;
    } else if (Auth.currentUser.role === AppConfig.USER_ROLES.DIVISION_OFFICER && Auth.currentUser.division) {
      // Division officer sees districts in their division
      const divisionDistricts = Object.keys(this.districtToDivision).filter(district => this.districtToDivision[district] === Auth.currentUser.division);
      divisionDistricts.forEach(district => {
        tableHTML += `<option value="${district}">${district}</option>`;
      });
    }
    
    tableHTML += `
                </select>
              </div>
              
              <div class="mb-3">
                <label for="proposedTarget" class="form-label">प्रस्तावित लक्ष्य</label>
                <input type="number" class="form-control" id="proposedTarget" required>
              </div>
              
              <div class="mb-3">
                <label for="totalSamplesTaken" class="form-label">कुल लिये गये नमूनों की संख्या</label>
                <input type="number" class="form-control" id="totalSamplesTaken" required>
              </div>
              
              <div class="mb-3">
                <label for="samplesSentToLab" class="form-label">प्रयोगशाला को प्रेषित नमूनों की संख्या</label>
                <input type="number" class="form-control" id="samplesSentToLab" required>
              </div>
              
              <div class="mb-3">
                <label for="actionTaken" class="form-label">कार्यवाही</label>
                <input type="text" class="form-control" id="actionTaken">
              </div>
              
              <div class="mb-3">
                <label for="date" class="form-label">दिनांक</label>
                <input type="date" class="form-control" id="date" required>
              </div>
              
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-plus-lg me-2"></i>जोड़ें
              </button>
            </form>
          </div>
        </div>
        
        <!-- Data Table -->
        <div class="card">
          <div class="card-header">बीज नमूने</div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>क्र.</th>
                    <th>जिला</th>
                    <th>प्रस्तावित लक्ष्य</th>
                    <th>कुल लिये गये नमूनों की संख्या</th>
                    <th>प्रयोगशाला को प्रेषित नमूनों की संख्या</th>
                    <th>कार्यवाही</th>
                    <th>दिनांक</th>
                    <th>कार्य</th>
                  </tr>
                </thead>
                <tbody id="seedSampleTableBody">`;
    
    // Add table rows
    seedSamples.forEach((sample, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${sample.district}</td>
          <td>${sample.proposed_target}</td>
          <td>${sample.total_samples_taken}</td>
          <td>${sample.samples_sent_to_lab}</td>
          <td>${sample.action_taken}</td>
          <td>${AppConfig.formatDateInHindi(sample.date)}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-pencil"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    tableHTML += `
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    
    contentArea.innerHTML = tableHTML;
  },
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  handleFormSubmit: async function(e) {
    e.preventDefault();
    
    // Get form values
    const district = document.getElementById('district').value;
    const proposedTarget = document.getElementById('proposedTarget').value;
    const totalSamplesTaken = document.getElementById('totalSamplesTaken').value;
    const samplesSentToLab = document.getElementById('samplesSentToLab').value;
    const actionTaken = document.getElementById('actionTaken').value;
    const date = document.getElementById('date').value;
    
    // Validate form values (add more validation as needed)
    if (!district || !proposedTarget || !totalSamplesTaken || !samplesSentToLab || !date) {
      alert('कृपया सभी आवश्यक फ़ील्ड भरें।');
      return;
    }
    
    // Create data object
    const sampleData = {
      district: district,
      proposed_target: proposedTarget,
      total_samples_taken: totalSamplesTaken,
      samples_sent_to_lab: samplesSentToLab,
      action_taken: actionTaken,
      date: date
    };
    
    try {
      // Insert data into Supabase
      const { data, error } = await AppConfig.supabase
        .from(AppConfig.TABLES.SEED_SAMPLES)
        .insert([sampleData])
        .select();
      
      if (error) {
        console.error('Error inserting data:', error);
        alert('डेटा सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        return;
      }
      
      // Clear form
      document.getElementById('seedSampleForm').reset();
      
      // Reload seed samples table
      this.loadSeedSamples();
      
      alert('डेटा सफलतापूर्वक सबमिट किया गया!');
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('प्रपत्र सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
  },
  
  /**
   * Helper function to generate options for select dropdown
   * @param {Array} options - Array of options
   * @param {String} selectedValue - Currently selected value
   * @returns {String} HTML string of options
   */
  generateOptions: function(options, selectedValue) {
    let optionsHTML = '';
    options.forEach(option => {
      const selected = option === selectedValue ? 'selected' : '';
      optionsHTML += `<option value="${option}" ${selected}>${option}</option>`;
    });
    return optionsHTML;
  },
  
  /**
   * Mapping for district to division
   */
  districtToDivision: {
    'रायपुर': 'रायपुर संभाग',
    'दुर्ग': 'दुर्ग संभाग',
    'बिलासपुर': 'बिलासपुर संभाग',
    'सरगुजा': 'सरगुजा संभाग',
    'बस्तर': 'बस्तर संभाग'
  }
};

// Initialize seed samples module
document.addEventListener('DOMContentLoaded', function() {
  SeedSamples.init();
});
