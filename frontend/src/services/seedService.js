// Seed data service for the Beej application

import { supabase } from './supabase';

export const seedService = {
  // Get all seed inspection reports
  async getSeedInspectionReports() {
    const { data, error } = await supabase
      .from('seed_inspection_report')
      .select('*');
    
    if (error) throw error;
    return data;
  },
  
  // Get seed inspection report by ID
  async getSeedInspectionReportById(id) {
    const { data, error } = await supabase
      .from('seed_inspection_report')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create new seed inspection report
  async createSeedInspectionReport(reportData) {
    const { data, error } = await supabase
      .from('seed_inspection_report')
      .insert([reportData])
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Update seed inspection report
  async updateSeedInspectionReport(id, reportData) {
    const { data, error } = await supabase
      .from('seed_inspection_report')
      .update(reportData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  // Delete seed inspection report
  async deleteSeedInspectionReport(id) {
    const { error } = await supabase
      .from('seed_inspection_report')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
