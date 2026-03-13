import { supabase, supabaseConfigured } from '../lib/supabase';
import {
  mockComplaints, mockAllComplaints,
  type Complaint, type ComplaintStatus, type ComplaintPriority, type ComplaintCategory, type Comment,
} from '../data/mockData';

function generateComplaintId(): string {
  return `CMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000 + 10000))}`;
}

function dbRowToComplaint(row: Record<string, unknown>, comments: Comment[] = []): Complaint {
  return {
    id: row.complaint_id as string,
    title: row.title as string,
    category: row.category as ComplaintCategory,
    department: row.department as string,
    priority: row.priority as ComplaintPriority,
    status: row.status as ComplaintStatus,
    date: new Date(row.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: row.description as string,
    location: row.location as string,
    citizenName: row.citizen_name as string,
    citizenId: row.citizen_id as string,
    assignedTo: (row.assigned_to as string) || undefined,
    comments,
    _dbId: row.id as string,
  };
}

export async function getComplaintsByUser(userId: string): Promise<Complaint[]> {
  if (!supabaseConfigured) {
    return mockComplaints.filter(c => c.citizenId === '1');
  }
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('citizen_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const complaints: Complaint[] = [];
  for (const row of data) {
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('complaint_id', row.id)
      .order('created_at', { ascending: true });

    const comments: Comment[] = (commentsData || []).map(c => ({
      id: c.id,
      author: c.author,
      role: c.role,
      message: c.message,
      timestamp: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
    }));

    complaints.push(dbRowToComplaint(row, comments));
  }

  return complaints;
}

export async function getAllComplaints(): Promise<Complaint[]> {
  if (!supabaseConfigured) {
    return mockAllComplaints;
  }
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const complaints: Complaint[] = [];
  for (const row of data) {
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('complaint_id', row.id)
      .order('created_at', { ascending: true });

    const comments: Comment[] = (commentsData || []).map(c => ({
      id: c.id,
      author: c.author,
      role: c.role,
      message: c.message,
      timestamp: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
    }));

    complaints.push(dbRowToComplaint(row, comments));
  }

  return complaints;
}

export async function getComplaintByComplaintId(complaintId: string): Promise<Complaint | null> {
  if (!supabaseConfigured) {
    return mockAllComplaints.find(c => c.id === complaintId) || null;
  }
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('complaint_id', complaintId)
    .single();

  if (error || !data) return null;

  const { data: commentsData } = await supabase
    .from('comments')
    .select('*')
    .eq('complaint_id', data.id)
    .order('created_at', { ascending: true });

  const comments: Comment[] = (commentsData || []).map(c => ({
    id: c.id,
    author: c.author,
    role: c.role,
    message: c.message,
    timestamp: new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
  }));

  return dbRowToComplaint(data, comments);
}

export interface CreateComplaintInput {
  title: string;
  category: ComplaintCategory;
  department: string;
  priority: ComplaintPriority;
  description: string;
  location: string;
  citizenId: string;
  citizenName: string;
}

export async function createComplaint(input: CreateComplaintInput): Promise<Complaint | null> {
  const complaintId = generateComplaintId();

  if (!supabaseConfigured) {
    const newComplaint: Complaint = {
      id: complaintId,
      title: input.title,
      category: input.category,
      department: input.department,
      priority: input.priority,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: input.description,
      location: input.location,
      citizenName: input.citizenName,
      citizenId: input.citizenId,
      assignedTo: undefined,
      comments: [],
    };
    return newComplaint;
  }

  const { data, error } = await supabase
    .from('complaints')
    .insert({
      complaint_id: complaintId,
      title: input.title,
      category: input.category,
      department: input.department,
      priority: input.priority,
      description: input.description,
      location: input.location,
      citizen_id: input.citizenId,
      citizen_name: input.citizenName,
    })
    .select()
    .single();

  if (error || !data) return null;
  return dbRowToComplaint(data);
}

export async function updateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
  assignedTo?: string,
): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const updateData: Record<string, unknown> = { status };
  if (assignedTo !== undefined) updateData.assigned_to = assignedTo;

  const { error } = await supabase
    .from('complaints')
    .update(updateData)
    .eq('complaint_id', complaintId);

  return !error;
}

export async function addComment(
  complaintDbId: string,
  author: string,
  role: string,
  message: string,
): Promise<Comment | null> {
  const newComment: Comment = {
    id: Date.now().toString(),
    author,
    role,
    message,
    timestamp: 'Just now',
  };

  if (!supabaseConfigured) return newComment;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      complaint_id: complaintDbId,
      author,
      role,
      message,
    })
    .select()
    .single();

  if (error || !data) return newComment;

  return {
    id: data.id,
    author: data.author,
    role: data.role,
    message: data.message,
    timestamp: 'Just now',
  };
}

export async function getComplaintStats(userId?: string) {
  if (!supabaseConfigured) {
    const source = userId ? mockComplaints.filter(c => c.citizenId === '1') : mockAllComplaints;
    return {
      total: source.length,
      pending: source.filter(c => c.status === 'Pending').length,
      inProgress: source.filter(c => c.status === 'In Progress').length,
      resolved: source.filter(c => c.status === 'Resolved').length,
      closed: source.filter(c => c.status === 'Closed').length,
      needsInfo: source.filter(c => c.status === 'Needs Info').length,
      verified: source.filter(c => c.status === 'Verified').length,
    };
  }

  let query = supabase.from('complaints').select('status');
  if (userId) query = query.eq('citizen_id', userId);

  const { data } = await query;
  const items = data || [];

  return {
    total: items.length,
    pending: items.filter(c => c.status === 'Pending').length,
    inProgress: items.filter(c => c.status === 'In Progress').length,
    resolved: items.filter(c => c.status === 'Resolved').length,
    closed: items.filter(c => c.status === 'Closed').length,
    needsInfo: items.filter(c => c.status === 'Needs Info').length,
    verified: items.filter(c => c.status === 'Verified').length,
  };
}
