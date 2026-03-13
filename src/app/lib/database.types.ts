export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'Citizen' | 'Official' | 'Admin';
          department: string | null;
          phone: string | null;
          status: 'Active' | 'Inactive' | 'Suspended';
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'Citizen' | 'Official' | 'Admin';
          department?: string | null;
          phone?: string | null;
          status?: 'Active' | 'Inactive' | 'Suspended';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'Citizen' | 'Official' | 'Admin';
          department?: string | null;
          phone?: string | null;
          status?: 'Active' | 'Inactive' | 'Suspended';
        };
      };
      complaints: {
        Row: {
          id: string;
          complaint_id: string;
          title: string;
          category: 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Other';
          department: string;
          priority: 'Low' | 'Medium' | 'High' | 'Urgent';
          status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Needs Info' | 'Verified';
          description: string;
          location: string;
          citizen_id: string;
          citizen_name: string;
          assigned_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          title: string;
          category: 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Other';
          department: string;
          priority: 'Low' | 'Medium' | 'High' | 'Urgent';
          status?: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Needs Info' | 'Verified';
          description: string;
          location: string;
          citizen_id: string;
          citizen_name: string;
          assigned_to?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          category?: 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Other';
          department?: string;
          priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
          status?: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Needs Info' | 'Verified';
          description?: string;
          location?: string;
          assigned_to?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          complaint_id: string;
          author: string;
          role: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          author: string;
          role: string;
          message: string;
          created_at?: string;
        };
        Update: {
          message?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          head: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          head: string;
          description: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
          head?: string;
          description?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'complaint' | 'system' | 'info';
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'complaint' | 'system' | 'info';
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
          message?: string;
        };
      };
    };
  };
}
