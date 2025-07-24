/**
 * Dashboard Module for Seed Testing Portal
 * Handles dashboard initialization, user information, and navigation
 */

// Define the Dashboard namespace
const Dashboard = {
  /**
   * Initialize the dashboard
   */
  init: function() {
    // Check if user is logged in
    if (!Auth.currentUser) {
      // Redirect to login page if not logged in
      window.location.href = 'index.html';
      return;
    }
    
    // Initialize UI components
    this.initializeUI();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load dashboard content
    this.loadPageContent('dashboard_content.html'); // Load dashboard content by default
  },
  
  /**
   * Initialize UI components
   */
  initializeUI: function() {
    // Set user information
    this.setUserInfo();
    
    // Initialize sidebar
    this.initializeSidebar();
    
    // Initialize user dropdown
    this.initializeUserDropdown();
    
    // Initialize charts (placeholder)
    //this.initializeCharts();
  },
  
  /**
   * Set user information in UI
   */
  setUserInfo: function() {
    const user = Auth.currentUser;
    
    // Set user name and initials
    const nameElements = document.querySelectorAll('#userName, #userNameLarge');
    const roleElements = document.querySelectorAll('#userRole, #userRoleLarge');
    const avatarElements = document.querySelectorAll('#userAvatar, #userAvatarLarge, #profileAvatar');
    
    nameElements.forEach(el => el.textContent = user.fullName);
    
    // Set role in Hindi
    const roleMap = {
      'state_admin': 'राज्य प्रशासक',
      'division_officer': 'संभागीय अधिकारी',
      'district_officer': 'जिला अधिकारी',
      'seed_certification_agency': 'बीज प्रमाणीकरण संस्था'
    };
    
    roleElements.forEach(el => el.textContent = roleMap[user.role] || user.role);
    
    // Set avatar initial
    const initial = user.fullName.charAt(0).toUpperCase();
    avatarElements.forEach(el => el.textContent = initial);
  },
  
  /**
   * Initialize sidebar
   */
  initializeSidebar: function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    });
    
    // Collapse sidebar on mobile by default
    if (window.innerWidth < 992) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
    }
  },
  
  /**
   * Initialize user dropdown
   */
  initializeUserDropdown: function() {
    const userDropdown = document.getElementById('userDropdown');
    
    userDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function(e) {
      if (!userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
      }
    });
  },
  
  /**
   * Setup event listeners for the dashboard
   */
  setupEventListeners: function() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
      const logoutModal = new bootstrap.Modal(document.getElementById('logoutConfirmModal'));
      logoutModal.show();
    });
    
    // Confirm logout
    document.getElementById('confirmLogoutBtn').addEventListener('click', function() {
      Auth.logout();
    });
    
    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    // Add click event listener to each link
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the page to load from the data-page attribute
        const pageToLoad = this.getAttribute('data-page');
        
        // Load the content of the selected page
        Dashboard.loadPageContent(pageToLoad);
        
        // Set active navigation link
        Dashboard.setActiveNavLink(this);
      });
    });
  },
  
  /**
   * Set active navigation link
   * @param {HTMLElement} link - The navigation link to set as active
   */
  setActiveNavLink: function(link) {
    document.querySelectorAll('.sidebar-menu a').forEach(el => {
      el.classList.remove('active');
    });
    link.classList.add('active');
  },
  
  /**
   * Load content of a page into the main content area
   */
  loadPageContent: function(pageUrl) {
    const contentArea = document.getElementById('pageContent');
    
    // Show loading message
    contentArea.innerHTML = '<div class="text-center"><div class="spinner-border"></div><p>सामग्री लोड हो रही है...</p></div>';
    
    // Fetch the content of the page
    fetch(pageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        // Insert the content into the main content area
        contentArea.innerHTML = data;
        
        // Run any scripts in the loaded content
        const scripts = contentArea.querySelectorAll('script');
        scripts.forEach(script => {
          eval(script.textContent);
        });
      })
      .catch(error => {
        console.error('Error loading page:', error);
        contentArea.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
      });
  },
  
  /**
   * Initialize charts
   */
  initializeCharts: function() {
    // This is a placeholder - will be implemented later
  }
};

document.addEventListener('DOMContentLoaded', function() {
  Dashboard.init();
});

