/**
 * Authentication Module for Seed Testing Portal
 * Handles user login, logout, session management, and access control
 */

// Define the Auth namespace
const Auth = {
  // Current user information
  currentUser: null,
  
  /**
   * Initialize authentication module
   */
  init: function() {
    // Check if user is already logged in
    this.checkSession();
    
    // Set up event listeners for login/logout
    this.setupEventListeners();
  },
  
  /**
   * Check if a user session exists
   * @returns {Boolean} Whether a valid session exists
   */
  checkSession: function() {
    // Get user data from session storage
    const userData = sessionStorage.getItem('currentUser');
    
    if (userData) {
      try {
        // Parse user data
        this.currentUser = JSON.parse(userData);
        return true;
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.logout();
        return false;
      }
    }
    
    return false;
  },
  
  /**
   * Set up event listeners for authentication
   */
  setupEventListeners: function() {
    // Check if we're on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }
    
    // Check if logout button exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', this.showLogoutConfirmation.bind(this));
    }
    
    // Check if logout confirmation button exists
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    if (confirmLogoutBtn) {
      confirmLogoutBtn.addEventListener('click', this.logout.bind(this));
    }
    
    // Check if change password form exists
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', this.handlePasswordChange.bind(this));
    }
  },
  
  /**
   * Handle login form submission
   * @param {Event} e - Form submit event
   */
  handleLogin: function(e) {
    e.preventDefault();
    
    // Get form data
    const userType = document.getElementById('userType').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!userType) {
      this.showError('कृपया उपयोगकर्ता प्रकार चुनें।');
      return;
    }
    
    // Show loading overlay
    this.showLoading(true);
    
    try {
      // Authenticate user
      const result = this.authenticateUser(userType, password);
      
      if (result.success) {
        // Login successful
        this.loginSuccess(result.user);
      } else {
        // Login failed
        this.loginFailed(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.loginFailed('लॉगिन प्रक्रिया में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।');
    }
  },
  
  /**
   * Handle password change
   * @param {Event} e - Form submit event
   */
  handlePasswordChange: function(e) {
    e.preventDefault();
    
    // Get form data
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('कृपया सभी फील्ड भरें');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('नया पासवर्ड और पुष्टि पासवर्ड मैच नहीं करते');
      return;
    }
    
    // Check password strength
    if (newPassword.length < 8) {
      alert('पासवर्ड कम से कम 8 अक्षर लंबा होना चाहिए');
      return;
    }
    
    // Change password
    if (this.changePassword(this.currentUser.username, currentPassword, newPassword)) {
      alert('पासवर्ड सफलतापूर्वक अपडेट किया गया!');
      
      // Close modal
      const passwordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
      passwordModal.hide();
      
      // Reset form
      document.getElementById('changePasswordForm').reset();
    } else {
      alert('वर्तमान पासवर्ड गलत है। कृपया पुनः प्रयास करें।');
    }
  },
  
  /**
   * Change user password
   * @param {String} username - Username
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @returns {Boolean} Success status
   */
  changePassword: function(username, currentPassword, newPassword) {
    // Get stored passwords from localStorage
    let storedPasswords = JSON.parse(localStorage.getItem('userPasswords')) || {};
    
    // Check if user exists and current password is correct
    const defaultPassword = this.getDefaultPassword(username);
    const storedPassword = storedPasswords[username];
    
    // Check against stored password first, then against default password
    if ((storedPassword && currentPassword === storedPassword) || 
        (!storedPassword && currentPassword === defaultPassword)) {
      
      // Update password in localStorage
      storedPasswords[username] = newPassword;
      localStorage.setItem('userPasswords', JSON.stringify(storedPasswords));
      
      return true;
    }
    
    return false;
  },
  
  /**
   * Get default password for a user
   * @param {String} username - Username to get password for
   * @returns {String} Default password
   */
  getDefaultPassword: function(username) {
    // Default passwords for users
    const userCredentials = {
      'deputy_director_state': 'State@123',
      'seed_certification_raipur': 'SeedCert@123',
      'joint_director_रायपुर_संभाग': 'Raipur@123',
      'joint_director_दुर्ग_संभाग': 'Durg@123',
      'joint_director_बिलासपुर_संभाग': 'Bilaspur@123',
      'joint_director_सरगुजा_संभाग': 'Surguja@123',
      'joint_director_बस्तर_संभाग': 'Bastar@123',
      'deputy_director_रायपुर': 'Raipur@123',
      'deputy_director_गरियाबंद': 'Gariaband@123',
      'deputy_director_बलौदाबाजार': 'Baloda@123',
      'deputy_director_महासमुंद': 'Mahasamund@123',
      'deputy_director_धमतरी': 'Dhamtari@123',
      'deputy_director_दुर्ग': 'Durg@123',
      'deputy_director_बालोद': 'Balod@123',
      'deputy_director_बेमेतरा': 'Bemetara@123',
      'deputy_director_कबीरधाम': 'Kabeerdham@123',
      'deputy_director_राजनांदगांव': 'Rajnandgaon@123',
      'deputy_director_बिलासपुर': 'Bilaspur@123',
      'deputy_director_मुंगेली': 'Mungeli@123',
      'deputy_director_कोरबा': 'Korba@123',
      'deputy_director_रायगढ़': 'Raigarh@123',
      'deputy_director_जांजगीर': 'Janjgir@123',
      'deputy_director_सक्ती': 'Sakti@123',
      'deputy_director_सारंगढ़-बिलाईगढ़': 'Sarangarh@123',
      'deputy_director_सरगुजा': 'Surguja@123',
      'deputy_director_सूरजपुर': 'Surajpur@123',
      'deputy_director_बलरामपुर': 'Balrampur@123',
      'deputy_director_कोरिया': 'Korea@123',
      'deputy_director_मनेन्द्रगढ़-चिरमिरी': 'Manendragarh@123',
      'deputy_director_जशपुर': 'Jashpur@123',
      'deputy_director_जगदलपुर': 'Jagdalpur@123',
      'deputy_director_कोण्डागांव': 'Kondagaon@123',
      'deputy_director_कांकेर': 'Kanker@123',
      'deputy_director_दंतेवाड़ा': 'Dantewada@123',
      'deputy_director_सुकमा': 'Sukma@123',
      'deputy_director_बीजापुर': 'Bijapur@123',
      'deputy_director_नारायणपुर': 'Narayanpur@123'
    };
    
    // For testing: Set all passwords to 'password'
    const testMode = false;
    if (testMode) {
      return 'password';
    }
    
    return userCredentials[username] || null;
  },
  
  /**
   * Authenticate user against credentials
   * @param {String} username - Username to authenticate
   * @param {String} password - Password to verify
   * @returns {Object} Authentication result
   */
  authenticateUser: function(username, password) {
    // Check for stored passwords first
    const storedPasswords = JSON.parse(localStorage.getItem('userPasswords')) || {};
    const defaultPassword = this.getDefaultPassword(username);
    
    // If no default password exists for this user
    if (!defaultPassword) {
      return { success: false, message: 'अमान्य उपयोगकर्ता' };
    }
    
    // If user has a stored password, check against that first
    if (storedPasswords[username] && password === storedPasswords[username]) {
      // Password matches stored password
      return this.createSuccessResult(username);
    }
    
    // Fall back to default password if no stored password or stored password doesn't match
    if (password === defaultPassword) {
      return this.createSuccessResult(username);
    }
    
    // Authentication failed
    return { success: false, message: 'अमान्य पासवर्ड। कृपया पुनः प्रयास करें।' };
  },
  
  /**
   * Create success result with user object
   * @param {String} username - Username
   * @returns {Object} Success result with user object
   */
  createSuccessResult: function(username) {
    // User roles
    const userRoles = {
      'deputy_director_state': 'state_admin',
      'seed_certification_raipur': 'seed_certification_agency',
      'joint_director_रायपुर_संभाग': 'division_officer',
      'joint_director_दुर्ग_संभाग': 'division_officer',
      'joint_director_बिलासपुर_संभाग': 'division_officer',
      'joint_director_सरगुजा_संभाग': 'division_officer',
      'joint_director_बस्तर_संभाग': 'division_officer'
    };
    
    // Set district officer roles
    ['रायपुर', 'गरियाबंद', 'बलौदाबाजार', 'महासमुंद', 'धमतरी', 'दुर्ग', 'बालोद', 
     'बेमेतरा', 'कबीरधाम', 'राजनांदगांव', 'बिलासपुर', 'मुंगेली', 'कोरबा', 'रायगढ़',
     'जांजगीर', 'सक्ती', 'सारंगढ़-बिलाईगढ़', 'सरगुजा', 'सूरजपुर', 'बलरामपुर', 'कोरिया',
     'मनेन्द्रगढ़-चिरमिरी', 'जशपुर', 'जगदलपुर', 'कोण्डागांव', 'कांकेर', 'दंतेवाड़ा',
     'सुकमा', 'बीजापुर', 'नारायणपुर'].forEach(district => {
      userRoles[`deputy_director_\${district}`] = 'district_officer';
    });
    
    // User full names
    const userFullNames = {
      'deputy_director_state': 'उप संचालक कृषि - राज्य स्तर',
      'seed_certification_raipur': 'बीज प्रमाणीकरण संस्था, रायपुर',
      'joint_director_रायपुर_संभाग': 'संयुक्त संचालक कृषि - रायपुर संभाग',
      'joint_director_दुर्ग_संभाग': 'संयुक्त संचालक कृषि - दुर्ग संभाग',
      'joint_director_बिलासपुर_संभाग': 'संयुक्त संचालक कृषि - बिलासपुर संभाग',
      'joint_director_सरगुजा_संभाग': 'संयुक्त संचालक कृषि - सरगुजा संभाग',
      'joint_director_बस्तर_संभाग': 'संयुक्त संचालक कृषि - बस्तर संभाग',
      'deputy_director_रायपुर': 'उप संचालक कृषि - रायपुर',
      'deputy_director_गरियाबंद': 'उप संचालक कृषि - गरियाबंद',
      'deputy_director_बलौदाबाजार': 'उप संचालक कृषि - बलौदाबाजार',
      'deputy_director_महासमुंद': 'उप संचालक कृषि - महासमुंद',
      'deputy_director_धमतरी': 'उप संचालक कृषि - धमतरी',
      'deputy_director_दुर्ग': 'उप संचालक कृषि - दुर्ग',
      'deputy_director_बालोद': 'उप संचालक कृषि - बालोद',
      'deputy_director_बेमेतरा': 'उप संचालक कृषि - बेमेतरा',
      'deputy_director_कबीरधाम': 'उप संचालक कृषि - कबीरधाम',
      'deputy_director_राजनांदगांव': 'उप संचालक कृषि - राजनांदगांव',
      'deputy_director_बिलासपुर': 'उप संचालक कृषि - बिलासपुर',
      'deputy_director_मुंगेली': 'उप संचालक कृषि - मुंगेली',
      'deputy_director_कोरबा': 'उप संचालक कृषि - कोरबा',
      'deputy_director_रायगढ़': 'उप संचालक कृषि - रायगढ़',
      'deputy_director_जांजगीर': 'उप संचालक कृषि - जांजगीर',
      'deputy_director_सक्ती': 'उप संचालक कृषि - सक्ती',
      'deputy_director_सारंगढ़-बिलाईगढ़': 'उप संचालक कृषि - सारंगढ़-बिलाईगढ़',
      'deputy_director_सरगुजा': 'उप संचालक कृषि - सरगुजा',
      'deputy_director_सूरजपुर': 'उप संचालक कृषि - सूरजपुर',
      'deputy_director_बलरामपुर': 'उप संचालक कृषि - बलरामपुर',
      'deputy_director_कोरिया': 'उप संचालक कृषि - कोरिया',
      'deputy_director_मनेन्द्रगढ़-चिरमिरी': 'उप संचालक कृषि - मनेन्द्रगढ़-चिरमिरी',
      'deputy_director_जशपुर': 'उप संचालक कृषि - जशपुर',
      'deputy_director_जगदलपुर': 'उप संचालक कृषि - जगदलपुर',
      'deputy_director_कोण्डागांव': 'उप संचालक कृषि - कोण्डागांव',
      'deputy_director_कांकेर': 'उप संचालक कृषि - कांकेर',
      'deputy_director_दंतेवाड़ा': 'उप संचालक कृषि - दंतेवाड़ा',
      'deputy_director_सुकमा': 'उप संचालक कृषि - सुकमा',
      'deputy_director_बीजापुर': 'उप संचालक कृषि - बीजापुर',
      'deputy_director_नारायणपुर': 'उप संचालक कृषि - नारायणपुर'
    };
    
    // District to Division mapping
    const districtToDivision = {
      'रायपुर': 'रायपुर संभाग',
      'गरियाबंद': 'रायपुर संभाग',
      'बलौदाबाजार': 'रायपुर संभाग',
      'महासमुंद': 'रायपुर संभाग',
      'धमतरी': 'रायपुर संभाग',
      'दुर्ग': 'दुर्ग संभाग',
      'बालोद': 'दुर्ग संभाग',
      'बेमेतरा': 'दुर्ग संभाग',
      'कबीरधाम': 'दुर्ग संभाग',
      'राजनांदगांव': 'दुर्ग संभाग',
      'खैरागढ़': 'दुर्ग संभाग',
      'मोहला': 'दुर्ग संभाग',
      'बिलासपुर': 'बिलासपुर संभाग',
      'मुंगेली': 'बिलासपुर संभाग',
      'कोरबा': 'बिलासपुर संभाग',
      'रायगढ़': 'बिलासपुर संभाग',
      'जांजगीर': 'बिलासपुर संभाग',
      'सक्ती': 'बिलासपुर संभाग',
      'सारंगढ़-बिलाईगढ़': 'बिलासपुर संभाग',
      'सरगुजा': 'सरगुजा संभाग',
      'सूरजपुर': 'सरगुजा संभाग',
      'बलरामपुर': 'सरगुजा संभाग',
      'कोरिया': 'सरगुजा संभाग',
      'मनेन्द्रगढ़-चिरमिरी': 'सरगुजा संभाग',
      'जशपुर': 'सरगुजा संभाग',
      'जगदलपुर': 'बस्तर संभाग',
      'कोण्डागांव': 'बस्तर संभाग',
      'कांकेर': 'बस्तर संभाग',
      'दंतेवाड़ा': 'बस्तर संभाग',
      'सुकमा': 'बस्तर संभाग',
      'बीजापुर': 'बस्तर संभाग',
      'नारायणपुर': 'बस्तर संभाग'
    };
    
    // Create user object
    const user = {
      username: username,
      role: userRoles[username],
      fullName: userFullNames[username]
    };
    
    // Add district/division info if applicable
    if (user.role === 'district_officer') {
      const districtName = user.fullName.split(' - ')[1];
      user.district = districtName;
      user.division = districtToDivision[districtName];
    } else if (user.role === 'division_officer') {
      const divisionName = user.fullName.split(' - ')[1];
      user.division = divisionName;
    }
    
    return { success: true, user: user };
  },
  
  /**
   * Handle successful login
   * @param {Object} user - User data
   */
  loginSuccess: function(user) {
    // Store user in session storage
    this.currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Remember user if checkbox is checked
    if (document.getElementById('rememberMe').checked) {
      localStorage.setItem('rememberedUser', user.username);
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    // Show success message
    this.showSuccess('लॉगिन सफल! अब आपको डैशबोर्ड पर निर्देशित किया जा रहा है...');
    
    // Redirect to dashboard after a brief delay
    setTimeout(function() {
      window.location.href = 'dashboard.html';
    }, 1000);
  },
  
  /**
   * Handle failed login
   * @param {String} message - Error message to display
   */
  loginFailed: function(message) {
    // Hide loading overlay
    this.showLoading(false);
    
    // Show error message
    this.showError(message || 'अमान्य उपयोगकर्ता नाम या पासवर्ड। कृपया पुनः प्रयास करें।');
    
    // Focus on password field
    const passwordField = document.getElementById('password');
    if (passwordField) {
      passwordField.focus();
      passwordField.select();
    }
  },
  
  /**
   * Show logout confirmation dialog
   */
  showLogoutConfirmation: function() {
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutConfirmModal'));
    logoutModal.show();
  },
  
  /**
   * Log out the current user
   */
  logout: function() {
    // Clear session storage
    sessionStorage.removeItem('currentUser');
    this.currentUser = null;
    
    // Redirect to login page
    window.location.href = 'index.html';
  },
  
  /**
   * Check if user has permission to access a resource
   * @param {String} resource - Resource to check access for
   * @param {String} action - Action to check (read, write, delete)
   * @returns {Boolean} Whether user has access
   */
  hasAccess: function(resource, action = 'read') {
    if (!this.currentUser) {
      return false;
    }
    
    const role = this.currentUser.role;
    
    // State admin has access to everything
    if (role === 'state_admin') {
      return true;
    }
    
    // Seed certification agency has limited access
    if (role === 'seed_certification_agency') {
      // Can only update specific columns in seed samples
      if (resource === 'seed_samples' && action === 'write') {
        return true; // Column-level permissions are handled elsewhere
      }
      return action === 'read'; // Can only read other resources
    }
    
    // Division officers have read access to everything and write access to their division
    if (role === 'division_officer') {
      if (action === 'read') {
        return true;
      }
      // For write and delete actions, need to check division
      return this.currentUser.division !== undefined;
    }
    
    // District officers have read access to everything and write access to their district
    if (role === 'district_officer') {
      if (action === 'read') {
        return true;
      }
      // For write and delete actions, need to check district
      return this.currentUser.district !== undefined;
    }
    
    return false;
  },
  
  /**
   * Filter data based on user's access level
   * @param {Array} data - Data to filter
   * @param {String} districtField - Field name containing district information
   * @returns {Array} Filtered data
   */
  filterDataByAccess: function(data, districtField = 'जिला') {
    if (!this.currentUser || !data) {
      return [];
    }
    
    const role = this.currentUser.role;
    
    // State admin sees all data
    if (role === 'state_admin') {
      return data;
    }
    
    // Division officers see data from their division
    if (role === 'division_officer' && this.currentUser.division) {
      return data.filter(item => {
        const district = item[districtField];
        return this.isDistrictInDivision(district, this.currentUser.division);
      });
    }
    
    // District officers see only their district's data
    if (role === 'district_officer' && this.currentUser.district) {
      return data.filter(item => item[districtField] === this.currentUser.district);
    }
    
    // Seed certification agency sees all data (read-only for most fields)
    if (role === 'seed_certification_agency') {
      return data;
    }
    
    return [];
  },
  
  /**
   * Check if a district belongs to a division
   * @param {String} district - District name
   * @param {String} division - Division name
   * @returns {Boolean} Whether district belongs to division
   */
  isDistrictInDivision: function(district, division) {
    const districtToDivision = {
      'रायपुर': 'रायपुर संभाग',
      'गरियाबंद': 'रायपुर संभाग',
      'बलौदाबाजार': 'रायपुर संभाग',
      'महासमुंद': 'रायपुर संभाग',
      'धमतरी': 'रायपुर संभाग',
      'दुर्ग': 'दुर्ग संभाग',
      'बालोद': 'दुर्ग संभाग',
      'बेमेतरा': 'दुर्ग संभाग',
      'कबीरधाम': 'दुर्ग संभाग',
      'राजनांदगांव': 'दुर्ग संभाग',
      'खैरागढ़': 'दुर्ग संभाग',
      'मोहला': 'दुर्ग संभाग',
      'बिलासपुर': 'बिलासपुर संभाग',
      'मुंगेली': 'बिलासपुर संभाग',
      'कोरबा': 'बिलासपुर संभाग',
      'रायगढ़': 'बिलासपुर संभाग',
      'जांजगीर': 'बिलासपुर संभाग',
      'सक्ती': 'बिलासपुर संभाग',
      'सारंगढ़-बिलाईगढ़': 'बिलासपुर संभाग',
      'सरगुजा': 'सरगुजा संभाग',
      'सूरजपुर': 'सरगुजा संभाग',
      'बलरामपुर': 'सरगुजा संभाग',
      'कोरिया': 'सरगुजा संभाग',
      'मनेन्द्रगढ़-चिरमिरी': 'सरगुजा संभाग',
      'जशपुर': 'सरगुजा संभाग',
      'जगदलपुर': 'बस्तर संभाग',
      'कोण्डागांव': 'बस्तर संभाग',
      'कांकेर': 'बस्तर संभाग',
      'दंतेवाड़ा': 'बस्तर संभाग',
      'सुकमा': 'बस्तर संभाग',
      'बीजापुर': 'बस्तर संभाग',
      'नारायणपुर': 'बस्तर संभाग'
    };
    
    return districtToDivision[district] === division;
  },
  
  /**
   * Show error message
   * @param {String} message - Error message to display
   */
  showError: function(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('d-none', 'alert-success');
      errorDiv.classList.add('alert-danger');
    }
  },
  
  /**
   * Show success message
   * @param {String} message - Success message to display
   */
  showSuccess: function(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('d-none', 'alert-danger');
      errorDiv.classList.add('alert-success');
    }
  },
  
  /**
   * Show/hide loading overlay
   * @param {Boolean} show - Whether to show or hide the overlay
   */
  showLoading: function(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      if (show) {
        loadingOverlay.classList.add('show');
      } else {
        loadingOverlay.classList.remove('show');
      }
    }
  }
};

// Initialize authentication when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  Auth.init();
});

// Make Auth available globally
window.Auth = Auth;

