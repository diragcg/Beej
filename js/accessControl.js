/**
 * Access Control Module for Seed Testing Portal
 * Handles role-based access control and data filtering
 */

// Define the AccessControl namespace
const AccessControl = {
  /**
   * Check if user has permission to access a resource
   * @param {String} resource - Resource to check access for
   * @param {String} action - Action to check (read, write, delete)
   * @returns {Boolean} Whether user has access
   */
  hasAccess: function(resource, action = 'read') {
    if (!Auth.currentUser) {
      return false;
    }
    
    const role = Auth.currentUser.role;
    
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
    
    // Division officers:
    if (role === AppConfig.USER_ROLES.DIVISION_OFFICER) {
      if (resource === AppConfig.TABLES.SEED_SAMPLES && action === 'read') {
        return true; // Division officers can read all seed samples
      }
      if (resource === AppConfig.TABLES.INSPECTION_REPORT && action === 'read') {
        return true; // Division officers can read all inspection reports
      }
      if (resource === AppConfig.TABLES.SEED_SAMPLES && action === 'write') {
           return true; // Division officers can write to seed samples
      }
      return false; // No other write access
    }

    // District officers:
    if (role === AppConfig.USER_ROLES.DISTRICT_OFFICER) {
      if (resource === AppConfig.TABLES.SEED_SAMPLES && action === 'read') {
        return true; // District officers can read all seed samples
      }
      if (resource === AppConfig.TABLES.INSPECTION_REPORT && action === 'read') {
           return true; // District officers can read all inspection reports
      }
       if (resource === AppConfig.TABLES.SEED_SAMPLES && action === 'write') {
           return true; // District officers can write to seed samples
      }
      return false; // No other write access
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
    if (!Auth.currentUser || !data) {
      return [];
    }
    
    const role = Auth.currentUser.role;
    
    // State admin sees all data
    if (role === AppConfig.USER_ROLES.STATE_ADMIN) {
      return data;
    }
    
    // Division officers see data from their division
    if (role === AppConfig.USER_ROLES.DIVISION_OFFICER && Auth.currentUser.division) {
      return data.filter(item => {
        const district = item[districtField];
        return this.isDistrictInDivision(district, Auth.currentUser.division);
      });
    }
    
    // District officers see only their district's data
    if (role === AppConfig.USER_ROLES.DISTRICT_OFFICER && Auth.currentUser.district) {
      return data.filter(item => item[districtField] === Auth.currentUser.district);
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
  }
};

// Make AccessControl available globally
window.AccessControl = AccessControl;

