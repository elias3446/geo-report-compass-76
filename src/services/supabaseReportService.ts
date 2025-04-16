
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type definitions
export type ReportStatus = 'pending' | 'in_progress' | 'assigned' | 'resolved' | 'closed' | 'rejected';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupabaseReport {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  location: any; // GeoJSON Point
  address: string | null;
  category_id: string | null;
  zone_id: string | null;
  reporter_id: string | null;
  assigned_to: string | null;
  supervisor_id: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  reporter?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  technician?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  zone?: {
    id: string;
    name: string;
  };
}

export interface ReportFilters {
  status?: ReportStatus | ReportStatus[];
  priority?: ReportPriority | ReportPriority[];
  category_id?: string;
  zone_id?: string;
  assigned_to?: string;
  reporter_id?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

// Get all reports with optional filtering
export const getReports = async (filters?: ReportFilters) => {
  try {
    let query = supabase
      .from('reports')
      .select(`
        *,
        category:category_id(id, name, icon, color),
        reporter:reporter_id(id, first_name, last_name),
        technician:assigned_to(id, first_name, last_name),
        zone:zone_id(id, name)
      `)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          query = query.in('priority', filters.priority);
        } else {
          query = query.eq('priority', filters.priority);
        }
      }
      
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters.zone_id) {
        query = query.eq('zone_id', filters.zone_id);
      }
      
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      
      if (filters.reporter_id) {
        query = query.eq('reporter_id', filters.reporter_id);
      }
      
      if (filters.from_date) {
        query = query.gte('created_at', filters.from_date);
      }
      
      if (filters.to_date) {
        query = query.lte('created_at', filters.to_date);
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return data as SupabaseReport[];
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    toast.error('Error al cargar reportes: ' + error.message);
    return [];
  }
};

// Get a single report by ID
export const getReportById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        category:category_id(id, name, icon, color),
        reporter:reporter_id(id, first_name, last_name),
        technician:assigned_to(id, first_name, last_name),
        zone:zone_id(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data as SupabaseReport;
  } catch (error: any) {
    console.error('Error fetching report:', error);
    toast.error('Error al cargar el reporte: ' + error.message);
    return null;
  }
};

// Create a new report
export const createReport = async (reportData: Omit<SupabaseReport, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Reporte creado exitosamente');
    return data as SupabaseReport;
  } catch (error: any) {
    console.error('Error creating report:', error);
    toast.error('Error al crear el reporte: ' + error.message);
    return null;
  }
};

// Update an existing report
export const updateReport = async (id: string, reportData: Partial<SupabaseReport>) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update(reportData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Reporte actualizado exitosamente');
    return data as SupabaseReport;
  } catch (error: any) {
    console.error('Error updating report:', error);
    toast.error('Error al actualizar el reporte: ' + error.message);
    return null;
  }
};

// Delete a report
export const deleteReport = async (id: string) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Reporte eliminado exitosamente');
    return true;
  } catch (error: any) {
    console.error('Error deleting report:', error);
    toast.error('Error al eliminar el reporte: ' + error.message);
    return false;
  }
};

// Get activities related to a report
export const getReportActivities = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('report_history')
      .select(`
        *,
        user:user_id(id, first_name, last_name)
      `)
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching report activities:', error);
    toast.error('Error al cargar el historial: ' + error.message);
    return [];
  }
};

// Get report statistics for dashboard
export const getReportsStats = async () => {
  try {
    // Get total reports count
    const { count: totalReports, error: countError } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Get reports by status
    const { data: statusData, error: statusError } = await supabase
      .from('reports')
      .select('status, count')
      .select('status')
      .then(({ data }) => {
        if (!data) return { data: null, error: new Error('No data returned') };
        
        // Count occurrences of each status
        const counts = {
          pending: 0,
          in_progress: 0,
          assigned: 0,
          resolved: 0,
          closed: 0,
          rejected: 0,
        };
        
        data.forEach(item => {
          counts[item.status as keyof typeof counts]++;
        });
        
        return { data: counts, error: null };
      });

    if (statusError) throw statusError;

    // Get reports by category
    const { data: categoryCounts, error: categoryError } = await supabase
      .from('reports')
      .select('category:categories(name), count')
      .select('category_id, categories(name)')
      .then(({ data }) => {
        if (!data) return { data: null, error: new Error('No data returned') };
        
        // Count and group by category name
        const counts: Record<string, number> = {};
        data.forEach(item => {
          const categoryName = item.categories?.name || 'Sin categoría';
          counts[categoryName] = (counts[categoryName] || 0) + 1;
        });
        
        // Convert to array of {name, value} objects
        const result = Object.entries(counts).map(([name, value]) => ({ name, value }));
        return { data: result, error: null };
      });

    if (categoryError) throw categoryError;

    return {
      totalReports,
      openIssues: statusData.pending + statusData.in_progress + statusData.assigned,
      resolvedIssues: statusData.resolved + statusData.closed,
      rejectedIssues: statusData.rejected,
      reportsByCategory: categoryCounts,
    };
  } catch (error: any) {
    console.error('Error fetching report stats:', error);
    toast.error('Error al cargar estadísticas: ' + error.message);
    return {
      totalReports: 0,
      openIssues: 0,
      resolvedIssues: 0,
      rejectedIssues: 0,
      reportsByCategory: [],
    };
  }
};
