/**
 * Authentication Module for Seed Testing Portal
 * Uses Supabase for authentication and user management
 */

// Define the Auth namespace
const Auth = {
  // Current user information
  currentUser: null,
  
  /**
   * Initialize authentication module
   */
  init: async function() {
    // Check if user is already logged in
    await this.checkSession();
    
    // Set up event listeners for login/logout
    this.setupEventListeners();
  },
  
  /**
   * Check if a user session exists
   * @returns {Boolean} Whether a valid session exists
   */
  checkSession: async function() {
    try {
      // Check if session exists in Supabase
      const { data, error } = await AppConfig.supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return false;
      }
      
      if (data?.session) {
        // Session exists, get user details
        const { user } = data.session;
        
        // Get additional user information from database
        const { data: userData, error: userError } = await AppConfig.supabase
          .from(AppConfig.TABLES.APP_USERS)
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          return false;
        }
        
        if (!userData) {
          console.error('User not found in database');
          return false;
        }
        
        // Create user object with combined data
        this.currentUser = {
          id: user.id,
          email: user.email,
          username: userData.username,
          fullName: userData.full_name,
          role: userData.user_role,
          district: userData.district_id ? await this.getDistrictName(userData.district_id) : null,
          division: userData.division_id ? await this.getDivisionName(userData.division_id) : null
        };
        
        // Store in session storage for convenience
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
      }
    } catch (e) {
      console.error('Session check exception:', e);
    }
    
    return false;
  },
  
  /**
   * Get district name from district ID
   * @param {Number} districtId - District ID
   * @returns {String} District name
   */
  getDistrictName: async function(districtId) {
    try {
      const { data, error } = await AppConfig.supabase
        .from(AppConfig.TABLES.DISTRICTS)
        .select('district_name')
        .eq('id', districtId)
        .single();
      
      if (error || !data) {
        console.error('Error fetching district name:', error);
        return null;
      }
      
      return data.district_name;
    } catch (e) {
      console.error('Error getting district name:', e);
      return null;
    }
  },
  
  /**
   * Get division name from division ID
   * @param {Number} divisionId - Division ID
   * @returns {String} Division name
   */
  getDivisionName: async function(divisionId) {
    try {
      const { data, error } = await AppConfig.supabase
        .from(AppConfig.TABLES.DIVISIONS)
        .select('division_name')
        .eq('id', divisionId)
        .single();
      
      if (error || !data) {
        console.error('Error fetching division name:', error);
        return null;
      }
      
      return data.division_name;
    } catch (e) {
      console.error('Error getting division name:', e);
      return null;
    }
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
  handleLogin: async function(e) {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
      this.showError('कृपया ईमेल और पासवर्ड दर्ज करें।');
      return;
    }
    
    // Show loading overlay
    this.showLoading(true);
    
    try {
      // Authenticate with Supabase
      const { data, error } = await AppConfig.supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('Login error:', error);
        this.loginFailed(error.message);
        return;
      }
      
      // Get user details from database
      const { data: userData, error: userError } = await AppConfig.supabase
        .from(AppConfig.TABLES.APP_USERS)
        .select('*')
        .eq('email', email)
        .single();
      
      if (userError || !userData) {
        console.error('Error fetching user data:', userError);
        this.loginFailed('उपयोगकर्ता जानकारी प्राप्त करने में त्रुटि।');
        return;
      }
      
      // Create user object
      const user = {
        id: data.user.id,
        email: email,
        username: userData.username,
        fullName: userData.full_name,
        role: userData.user_role,
        district: userData.district_id ? await this.getDistrictName(userData.district_id) : null,
        division: userData.division_id ? await this.getDivisionName(userData.division_id) : null
      };
      
      // Login successful
      this.loginSuccess(user);
    } catch (error) {
      console.error('Login exception:', error);
      this.loginFailed('लॉगिन प्रक्रिया में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।');
    }
  },
  
  /**
   * Handle password change
   * @param {Event} e - Form submit event
   */
  handlePasswordChange: async function(e) {
    e.preventDefault();
    
    // Get form data
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('कृपया सभी फील्ड भरें।');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।');
      return;
    }
    
    // Check password strength
    if (newPassword.length < 8) {
      alert('पासवर्ड कम से कम 8 अक्षर लंबा होना चाहिए।');
      return;
    }
    
    try {
      // Update password in Supabase
      const { error } = await AppConfig.supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        alert('पासवर्ड अपडेट करने में त्रुटि: ' + error.message);
        return;
      }
      
      // Password updated successfully
      alert('पासवर्ड सफलतापूर्वक अपडेट किया गया!');
      
      // Close modal if it exists
      const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
      if (modal) {
        modal.hide();
      }
      
      // Reset form
      e.target.reset();
    } catch (error) {
      console.error('Password change exception:', error);
      alert('पासवर्ड बदलने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।');
    }
  },
  
  /**
   * Handle successful login
   * @param {Object} user - User data
   */
  loginSuccess: function(user) {
    // Store user in session storage
    this.currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Remember email if checkbox is checked
    if (document.getElementById('rememberMe').checked) {
      localStorage.setItem('rememberedEmail', user.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    // Show success message
    this.showSuccess('लॉगिन सफल! अब आपको डैशबोर्ड पर निर्देशित किया जा रहा है...');
    
    // Update last login timestamp in database
    this.updateLastLogin(user.email);
    
    // Redirect to dashboard after a brief delay
    setTimeout(function() {
      window.location.href = AppConfig.PAGES.DASHBOARD;
    }, 1000);
  },
  
  /**
   * Update last login timestamp
   * @param {String} email - User email
   */
  updateLastLogin: async function(email) {
    try {
      await AppConfig.supabase
        .from(AppConfig.TABLES.APP_USERS)
        .update({ last_login: new Date().toISOString() })
        .eq('email', email);
    } catch (e) {
      console.error('Error updating last login:', e);
    }
  },
  
  /**
   * Handle failed login
   * @param {String} message - Error message to display
   */
  loginFailed: function(message) {
    // Hide loading overlay
    this.showLoading(false);
    
    // Show error message
    this.showError(message || 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।');
    
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
  logout: async function() {
    try {
      // Sign out from Supabase
      await AppConfig.supabase.auth.signOut();
      
      // Clear session storage
      sessionStorage.removeItem('currentUser');
      this.currentUser = null;
      
      // Redirect to login page
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout error:', error);
      alert('लॉगआउट प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
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
    if (role === AppConfig.USER_ROLES.STATE_ADMIN) {
      return true;
    }
    
    // Seed certification agency has limited access
    if (role === AppConfig.USER_ROLES.SEED_CERTIFICATION) {
      // Can only update specific columns in seed samples
      if (resource === AppConfig.TABLES.SEED_SAMPLES && action === 'write') {
        return true; // Column-level permissions are handled elsewhere
      }
      return action === 'read'; // Can only read other resources
    }
    
    // Division officers have read access to everything and write access to their division
    if (role === AppConfig.USER_ROLES.DIVISION_OFFICER) {
      if (action === 'read') {
        return true;
      }
      // For write and delete actions, need to check division
      return this.currentUser.division !== undefined;
    }
    
    // District officers have read access to everything and write access to their district
    if (role === AppConfig.USER_ROLES.DISTRICT_OFFICER) {
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
    if (role === AppConfig.USER_ROLES.STATE_ADMIN) {
      return data;
    }
    
    // Division officers see data from their division
    if (role === AppConfig.USER_ROLES.DIVISION_OFFICER && this.currentUser.division) {
      return data.filter(item => {
        const district = item[districtField];
        return this.isDistrictInDivision(district, this.currentUser.division);
      });
    }
    
    // District officers see only their district's data
    if (role === AppConfig.USER_ROLES.DISTRICT_OFFICER && this.currentUser.district) {
      return data.filter(item => item[districtField] === this.currentUser.district);
    }
    
    // Seed certification agency sees all data (read-only for most fields)
    if (role === AppConfig.USER_ROLES.SEED_CERTIFICATION) {
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

