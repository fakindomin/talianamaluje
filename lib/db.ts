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
  photos: string[];
  products: string[];
  public: boolean;
  modelId: string | null;
  modelName: string | null;
  textColor: string;
};

export type Model = {
  id: string;
  name: string;
  cover: string;
  coverAlt: string;
};

const PROJECT_SELECT = "id, slug, title, style, date_label, description, cover_url, cover_alt, photo_urls, products, is_public, model_id, text_color, models(name)";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  style: string;
  date_label: string;
  description: string;
  cover_url: string;
  cover_alt: string;
  photo_urls: string[] | null;
  products: string[] | null;
  is_public: boolean;
  model_id: string | null;
  text_color: string | null;
  models: { name: string } | { name: string }[] | null;
};

function mapProject(row: ProjectRow): Project {
  const modelName = Array.isArray(row.models) ? row.models[0]?.name ?? null : row.models?.name ?? null;
  const photos = row.photo_urls && row.photo_urls.length > 0 ? row.photo_urls : [row.cover_url];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    style: row.style,
    dateLabel: row.date_label,
    description: row.description,
    cover: row.cover_url,
    coverAlt: row.cover_alt,
    photos,
    products: row.products ?? [],
    public: row.is_public,
    modelId: row.model_id,
    modelName,
    textColor: row.text_color || "#F7EFEA"
  };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Nie udalo sie pobrac projektow: ${error.message}`);
  return (data ?? []).map((row) => mapProject(row as unknown as ProjectRow));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Nie udalo sie pobrac projektu: ${error.message}`);
  if (!data) return null;
  return mapProject(data as unknown as ProjectRow);
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
