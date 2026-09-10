import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new Error("Brak konfiguracji Supabase (SUPABASE_URL / SUPABASE_ANON_KEY).");
  if (!/^[\x00-\xFF]*$/.test(key)) {
    throw new Error("SUPABASE_ANON_KEY zawiera nieprawidlowy znak (sprawdz czy wartosc zostala wklejona poprawnie, bez znakow specjalnych typu •).");
  }
  return createClient(url, key);
}

export type Project = {
  id: string;
  slug: string;
  title: string;
  style: string;
  dateLabel: string;
  description: string;
  cover: string;
  coverAlt: string;
  products: string[];
  public: boolean;
};

export type Model = {
  id: string;
  name: string;
  cover: string;
  coverAlt: string;
};

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, style, date_label, description, cover_url, cover_alt, products, is_public")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Nie udalo sie pobrac projektow: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    style: row.style,
    dateLabel: row.date_label,
    description: row.description,
    cover: row.cover_url,
    coverAlt: row.cover_alt,
    products: row.products ?? [],
    public: row.is_public
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, style, date_label, description, cover_url, cover_alt, products, is_public")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Nie udalo sie pobrac projektu: ${error.message}`);
  if (!data) return null;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    style: data.style,
    dateLabel: data.date_label,
    description: data.description,
    cover: data.cover_url,
    coverAlt: data.cover_alt,
    products: data.products ?? [],
    public: data.is_public
  };
}

export async function getModelById(id: string): Promise<Model | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("models")
    .select("id, name, cover_url, cover_alt")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Nie udalo sie pobrac modelki: ${error.message}`);
  if (!data) return null;
  return { id: data.id, name: data.name, cover: data.cover_url, coverAlt: data.cover_alt };
}

export async function getModels(): Promise<Model[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("models")
    .select("id, name, cover_url, cover_alt")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Nie udalo sie pobrac modelek: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    cover: row.cover_url,
    coverAlt: row.cover_alt
  }));
}
