/**
 * Configuration file for the Seed Testing Portal
 * Contains all application-wide settings and constants
 */

// Supabase Configuration
const SUPABASE_URL = 'https://evgmvktquwufhdevtahx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2Z212a3RxdXd1ZmhkZXZ0YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjU0NTEsImV4cCI6MjA2ODg0MTQ1MX0.-JTBxxMms1U3H1nIzEQN54FEHKeHMP8HbUf7s3nIfIk';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// User Roles
const USER_ROLES = {
  STATE_ADMIN: 'state_admin',
  DIVISION_OFFICER: 'division_officer',
  DISTRICT_OFFICER: 'district_officer',
  SEED_CERTIFICATION: 'seed_certification_agency'
};

// Role Names in Hindi
const ROLE_NAMES = {
  'state_admin': 'राज्य प्रशासक',
  'division_officer': 'संभागीय अधिकारी',
  'district_officer': 'जिला अधिकारी',
  'seed_certification_agency': 'बीज प्रमाणीकरण संस्था'
};

// Table Names
const TABLES = {
  SEED_SAMPLES: 'seed_samples',
  INSPECTION_REPORT: 'seed_inspection_report',
  INSPECTION_REPORT_FORM2: 'seed_inspection_report_form2',
  INSPECTION_REPORT_FORM3: 'seed_inspection_report_form3',
  APP_USERS: 'app_users',
  DISTRICTS: 'districts',
  DIVISIONS: 'divisions'
};

// Status Types
const STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  STANDARD: 'standard',
  NON_STANDARD: 'non_standard'
};

// Status Names in Hindi
const STATUS_NAMES = {
  'pending': 'लंबित',
  'processing': 'प्रक्रियाधीन',
  'completed': 'पूर्ण',
  'standard': 'मानक',
  'non_standard': 'अमानक'
};

// Status Colors for UI
const STATUS_COLORS = {
  'pending': 'warning',
  'processing': 'info',
  'completed': 'success',
  'standard': 'success',
  'non_standard': 'danger'
};

// Application Pages
const PAGES = {
  DASHBOARD: 'dashboard.html',
  SEED_SAMPLES: 'pages/seedSamples.html',
  INSPECTION_REPORT: 'pages/inspectionReport.html',
  INSPECTION_REPORT_FORM2: 'pages/inspectionReportForm2.html',
  INSPECTION_REPORT_FORM3: 'pages/inspectionReportForm3.html',
  REPORTS: 'pages/reports.html',
  SETTINGS: 'pages/settings.html',
  PROFILE: 'pages/profile.html'
};

// Month Names in Hindi
const MONTH_NAMES = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

// Day Names in Hindi
const DAY_NAMES = [
  'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
];

// Format a date in Hindi
function formatDateInHindi(date) {
  if (!date) return '';
  
  const d = new Date(date);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

// Export all constants and functions for use in other files
window.AppConfig = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabase,
  USER_ROLES,
  ROLE_NAMES,
  TABLES,
  STATUS,
  STATUS_NAMES,
  STATUS_COLORS,
  PAGES,
  MONTH_NAMES,
  DAY_NAMES,
  formatDateInHindi
};

