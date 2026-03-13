import { supabase, supabaseConfigured } from '../lib/supabase';
import { mockDepartments, type Department } from '../data/mockData';

export async function getDepartments(): Promise<Department[]> {
  if (!supabaseConfigured) return mockDepartments;

  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true });

  if (error || !data) return [];

  const deptStats = await Promise.all(
    data.map(async (d) => {
      const { count: complaintsCount } = await supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('department', d.name);

      const { count: officialsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('department', d.name)
        .eq('role', 'Official');

      return {
        id: d.id,
        name: d.name,
        code: d.code,
        head: d.head,
        complaintsThisMonth: complaintsCount || 0,
        officials: officialsCount || 0,
        description: d.description,
      };
    }),
  );

  return deptStats;
}

export async function createDepartment(input: {
  name: string;
  code: string;
  head: string;
  description: string;
}): Promise<Department | null> {
  if (!supabaseConfigured) {
    return {
      id: Date.now().toString(),
      name: input.name,
      code: input.code,
      head: input.head,
      complaintsThisMonth: 0,
      officials: 0,
      description: input.description,
    };
  }

  const { data, error } = await supabase
    .from('departments')
    .insert(input)
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    code: data.code,
    head: data.head,
    complaintsThisMonth: 0,
    officials: 0,
    description: data.description,
  };
}

export async function updateDepartment(
  id: string,
  updates: { name?: string; code?: string; head?: string; description?: string },
): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const { error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', id);

  return !error;
}
