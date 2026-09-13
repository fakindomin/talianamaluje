"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/db";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e").replace(/ł/g, "l")
    .replace(/ń/g, "n").replace(/ó/g, "o").replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "makijaz";
}

function getPhotoUrls(formData: FormData, field: string): string[] {
  return formData.getAll(field).map((v) => String(v)).filter((url) => url.trim().length > 0);
}

async function resolveModelId(formData: FormData, fallbackCoverUrl: string | null): Promise<string | null> {
  const newModelName = String(formData.get("newModelName") || "").trim();
  const selectedModelId = String(formData.get("modelId") || "").trim();

  if (newModelName) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("models")
      .insert({
        name: newModelName,
        cover_url: fallbackCoverUrl ?? "",
        cover_alt: `Portret modelki ${newModelName}`
      })
      .select("id")
      .single();
    if (error) throw new Error(`Nie udalo sie utworzyc nowej modelki: ${error.message}`);
    return data.id;
  }

  return selectedModelId || null;
}

async function resolveCosmeticIds(formData: FormData): Promise<string[]> {
  const selectedIds = formData.getAll("cosmeticIds").map((v) => String(v)).filter(Boolean);
  const newNamesRaw = String(formData.get("newCosmetics") || "").trim();
  const newNames = newNamesRaw ? newNamesRaw.split(",").map((n) => n.trim()).filter(Boolean) : [];

  if (newNames.length === 0) return selectedIds;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("cosmetics")
    .insert(newNames.map((name) => ({ name })))
    .select("id");
  if (error) throw new Error(`Nie udalo sie utworzyc nowych kosmetykow: ${error.message}`);

  return [...selectedIds, ...(data ?? []).map((row) => row.id)];
}

export async function addProject(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const style = String(formData.get("style") || "").trim();
  const dateLabel = String(formData.get("dateLabel") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const isPublic = formData.get("isPublic") === "on";
  const textColor = String(formData.get("textColor") || "#F7EFEA").trim();
  const photoUrls = getPhotoUrls(formData, "photoUrls");
  const beforePhotoUrls = getPhotoUrls(formData, "beforePhotoUrls");

  if (!title || photoUrls.length === 0) {
    throw new Error("Tytul i przynajmniej jedno zdjecie sa wymagane.");
  }

  const modelId = await resolveModelId(formData, photoUrls[0]);
  const cosmeticIds = await resolveCosmeticIds(formData);
  const slug = slugify(title);

  const supabase = getSupabase();
  const { error } = await supabase.from("projects").insert({
    slug,
    title,
    style: style || "Bez kategorii",
    date_label: dateLabel || new Date().toLocaleDateString("pl-PL", { month: "long", year: "numeric" }),
    description,
    cover_url: photoUrls[0],
    cover_alt: title,
    photo_urls: photoUrls,
    before_photo_urls: beforePhotoUrls,
    cosmetic_ids: cosmeticIds,
    is_public: isPublic,
    model_id: modelId,
    text_color: textColor
  });
  if (error) throw new Error(`Nie udalo sie zapisac projektu: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/tematyczne");
  revalidatePath("/modelki");
  revalidatePath("/@nina-kaminska");
  revalidatePath("/studio");
  revalidatePath("/studio/modelki");
  redirect("/studio");
}

export async function addModel(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const photoUrls = getPhotoUrls(formData, "photoUrls");

  if (!name || photoUrls.length === 0) {
    throw new Error("Imie i przynajmniej jedno zdjecie sa wymagane.");
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("models").insert({
    name,
    cover_url: photoUrls[0],
    cover_alt: `Portret modelki ${name}`,
    photo_urls: photoUrls
  });
  if (error) throw new Error(`Nie udalo sie zapisac modelki: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath("/studio/modelki");
  redirect("/studio/modelki");
}

export async function updateProject(id: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const style = String(formData.get("style") || "").trim();
  const dateLabel = String(formData.get("dateLabel") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const isPublic = formData.get("isPublic") === "on";
  const textColor = String(formData.get("textColor") || "#F7EFEA").trim();
  const newPhotoUrls = getPhotoUrls(formData, "photoUrls");
  const newBeforePhotoUrls = getPhotoUrls(formData, "beforePhotoUrls");

  if (!title) throw new Error("Tytul jest wymagany.");

  const cosmeticIds = await resolveCosmeticIds(formData);
  const update: Record<string, unknown> = {
    title,
    style: style || "Bez kategorii",
    date_label: dateLabel,
    description,
    cosmetic_ids: cosmeticIds,
    is_public: isPublic,
    text_color: textColor
  };

  const supabase = getSupabase();

  if (newPhotoUrls.length > 0 || newBeforePhotoUrls.length > 0) {
    const { data: existing } = await supabase.from("projects").select("photo_urls, before_photo_urls").eq("id", id).maybeSingle();
    if (newPhotoUrls.length > 0) {
      const combined = [...(existing?.photo_urls ?? []), ...newPhotoUrls];
      update.photo_urls = combined;
      update.cover_url = combined[0];
      update.cover_alt = title;
    }
    if (newBeforePhotoUrls.length > 0) {
      update.before_photo_urls = [...(existing?.before_photo_urls ?? []), ...newBeforePhotoUrls];
    }
  }

  update.model_id = await resolveModelId(formData, (update.cover_url as string) ?? null);

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) throw new Error(`Nie udalo sie zaktualizowac projektu: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/tematyczne");
  revalidatePath("/modelki");
  revalidatePath("/@nina-kaminska");
  revalidatePath("/studio");
  revalidatePath("/studio/modelki");
  redirect("/studio");
}

export async function removeProjectPhoto(id: string, photoUrl: string) {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase.from("projects").select("photo_urls").eq("id", id).maybeSingle();
  if (fetchError) throw new Error(`Nie udalo sie pobrac projektu: ${fetchError.message}`);

  const remaining = (existing?.photo_urls ?? []).filter((url: string) => url !== photoUrl);
  if (remaining.length === 0) throw new Error("Projekt musi miec przynajmniej jedno zdjecie.");

  const { error } = await supabase.from("projects").update({ photo_urls: remaining, cover_url: remaining[0] }).eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac zdjecia: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/tematyczne");
  revalidatePath("/modelki");
  revalidatePath("/studio");
  revalidatePath(`/studio/projekty/${id}/edytuj`);
}

export async function removeProjectBeforePhoto(id: string, photoUrl: string) {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase.from("projects").select("before_photo_urls").eq("id", id).maybeSingle();
  if (fetchError) throw new Error(`Nie udalo sie pobrac projektu: ${fetchError.message}`);

  const remaining = (existing?.before_photo_urls ?? []).filter((url: string) => url !== photoUrl);

  const { error } = await supabase.from("projects").update({ before_photo_urls: remaining }).eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac zdjecia: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/studio");
  revalidatePath(`/studio/projekty/${id}/edytuj`);
}

export async function deleteProject(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac projektu: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/tematyczne");
  revalidatePath("/@nina-kaminska");
  revalidatePath("/studio");
  redirect("/studio");
}

export async function updateModel(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const newPhotoUrls = getPhotoUrls(formData, "photoUrls");

  if (!name) throw new Error("Imie jest wymagane.");

  const update: Record<string, unknown> = { name, cover_alt: `Portret modelki ${name}` };

  const supabase = getSupabase();

  if (newPhotoUrls.length > 0) {
    const { data: existing } = await supabase.from("models").select("photo_urls, cover_url").eq("id", id).maybeSingle();
    const combined = [...(existing?.photo_urls ?? []), ...newPhotoUrls];
    update.photo_urls = combined;
    if (!existing?.cover_url) update.cover_url = combined[0];
  }

  const { error } = await supabase.from("models").update(update).eq("id", id);
  if (error) throw new Error(`Nie udalo sie zaktualizowac modelki: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath(`/modelki/${id}`);
  revalidatePath("/studio/modelki");
  redirect("/studio/modelki");
}

export async function setModelCover(id: string, photoUrl: string) {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase.from("models").select("name").eq("id", id).maybeSingle();
  if (fetchError) throw new Error(`Nie udalo sie pobrac modelki: ${fetchError.message}`);

  const { error } = await supabase
    .from("models")
    .update({ cover_url: photoUrl, cover_alt: `Portret modelki ${existing?.name ?? ""}` })
    .eq("id", id);
  if (error) throw new Error(`Nie udalo sie ustawic zdjecia glownego: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath(`/modelki/${id}`);
  revalidatePath("/studio/modelki");
  revalidatePath(`/studio/modelki/${id}/edytuj`);
}

export async function removeModelPhoto(id: string, photoUrl: string) {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase.from("models").select("photo_urls, cover_url").eq("id", id).maybeSingle();
  if (fetchError) throw new Error(`Nie udalo sie pobrac modelki: ${fetchError.message}`);

  const remaining = (existing?.photo_urls ?? []).filter((url: string) => url !== photoUrl);
  if (remaining.length === 0) throw new Error("Modelka musi miec przynajmniej jedno zdjecie.");

  const update: Record<string, unknown> = { photo_urls: remaining };
  if (existing?.cover_url === photoUrl) update.cover_url = remaining[0];

  const { error } = await supabase.from("models").update(update).eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac zdjecia: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath(`/modelki/${id}`);
  revalidatePath("/studio/modelki");
  revalidatePath(`/studio/modelki/${id}/edytuj`);
}

export async function updateProfile(formData: FormData) {
  const displayName = String(formData.get("displayName") || "").trim();
  const brandName = String(formData.get("brandName") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const serviceArea = String(formData.get("serviceArea") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const avatarUrl = String(formData.get("avatarUrl") || "").trim();
  const specialtiesRaw = String(formData.get("specialties") || "").trim();

  if (!displayName || !slug) throw new Error("Imie i nazwisko oraz nick sa wymagane.");

  const specialties = specialtiesRaw ? specialtiesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const update: Record<string, unknown> = {
    display_name: displayName,
    brand_name: brandName,
    slug,
    city,
    service_area: serviceArea,
    bio,
    specialties
  };
  if (avatarUrl) {
    update.avatar_url = avatarUrl;
    update.avatar_alt = `Portret ${displayName}`;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("profile").update(update).eq("id", "default");
  if (error) throw new Error(`Nie udalo sie zapisac profilu: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/tematyczne");
  revalidatePath("/modelki");
  revalidatePath("/studio");
  revalidatePath("/studio/profil");
  redirect("/studio/profil");
}

export async function deleteModel(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("models").delete().eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac modelki: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath("/studio/modelki");
  redirect("/studio/modelki");
}

export async function addCosmetic(formData: FormData) {
  const brand = String(formData.get("brand") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const shade = String(formData.get("shade") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const barcode = String(formData.get("barcode") || "").trim();

  if (!name) throw new Error("Nazwa jest wymagana.");

  const supabase = getSupabase();
  const { error } = await supabase.from("cosmetics").insert({ brand, name, category, shade, notes, barcode });
  if (error) throw new Error(`Nie udalo sie zapisac kosmetyku: ${error.message}`);

  revalidatePath("/studio");
  revalidatePath("/studio/kosmetyki");
  redirect("/studio/kosmetyki");
}

export async function updateCosmetic(id: string, formData: FormData) {
  const brand = String(formData.get("brand") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const shade = String(formData.get("shade") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const barcode = String(formData.get("barcode") || "").trim();

  if (!name) throw new Error("Nazwa jest wymagana.");

  const supabase = getSupabase();
  const { error } = await supabase.from("cosmetics").update({ brand, name, category, shade, notes, barcode }).eq("id", id);
  if (error) throw new Error(`Nie udalo sie zaktualizowac kosmetyku: ${error.message}`);

  revalidatePath("/studio");
  revalidatePath("/studio/kosmetyki");
  redirect("/studio/kosmetyki");
}

export async function deleteCosmetic(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("cosmetics").delete().eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac kosmetyku: ${error.message}`);

  revalidatePath("/studio");
  revalidatePath("/studio/kosmetyki");
  redirect("/studio/kosmetyki");
}

export type BarcodeLookupResult = { brand: string; name: string; category: string } | null;

// Open Beauty Facts is queried client-side (it allows CORS); these two don't, so
// they're looked up here server-side as a fallback when it comes up empty.
export async function lookupBarcode(code: string): Promise<BarcodeLookupResult> {
  try {
    const res = await fetch(`https://world.openproductfacts.org/api/v0/product/${code}.json`);
    const data: { status: number; product?: { product_name?: string; brands?: string; categories?: string } } = await res.json();
    if (data.status === 1 && data.product) {
      const brand = data.product.brands?.split(",")[0]?.trim() ?? "";
      const name = data.product.product_name?.trim() ?? "";
      const category = data.product.categories?.split(",")[0]?.trim() ?? "";
      if (brand || name || category) return { brand, name, category };
    }
  } catch {
    // try the next source
  }

  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
    const data: { items?: { title?: string; brand?: string; category?: string }[] } = await res.json();
    const item = data.items?.[0];
    if (item) {
      const brand = item.brand?.trim() ?? "";
      const name = item.title?.trim() ?? "";
      const category = item.category?.split(">").pop()?.trim() ?? "";
      if (brand || name || category) return { brand, name, category };
    }
  } catch {
    // try the last source
  }

  return lookupBarcodeWithGemini(code);
}

async function callGemini(parts: unknown[], useGrounding: boolean): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts }],
      ...(useGrounding ? { tools: [{ google_search: {} }] } : {})
    })
  });
  const data: { candidates?: { content?: { parts?: { text?: string }[] } }[] } = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

function extractJsonObject<T>(text: string): T | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}

// Last resort: ask Gemini to search the web for the barcode (Google Search grounding),
// only used when none of the free product databases above had it. Skipped entirely if
// GEMINI_API_KEY isn't configured, so this stays fully optional.
async function lookupBarcodeWithGemini(code: string): Promise<BarcodeLookupResult> {
  try {
    const prompt = `Wyszukaj w internecie produkt kosmetyczny o kodzie kreskowym (EAN/UPC) ${code}. Odpowiedz WYLACZNIE obiektem JSON, bez zadnego dodatkowego tekstu ani formatowania markdown, w formacie: {"brand": "marka", "name": "pelna nazwa produktu", "category": "kategoria np. podklad, roz, szminka, tusz do rzes"}. Jesli ktoregos pola nie da sie ustalic, zostaw pusty string "".`;
    const text = await callGemini([{ text: prompt }], true);
    if (!text) return null;

    const parsed = extractJsonObject<{ brand?: string; name?: string; category?: string }>(text);
    if (!parsed) return null;
    const brand = parsed.brand?.trim() ?? "";
    const name = parsed.name?.trim() ?? "";
    const category = parsed.category?.trim() ?? "";
    if (brand || name || category) return { brand, name, category };
    return null;
  } catch {
    return null;
  }
}

export type ProductPhotoResult = { barcode: string; brand: string; name: string; category: string } | null;

// Used when a scanned photo has no decodable barcode: ask Gemini to read the label
// (and any printed EAN digits) directly from the image. Pure vision, no search grounding
// needed, so this works even without billing enabled on the Gemini API key.
export async function analyzeProductPhoto(photo: { base64: string; mimeType: string }): Promise<ProductPhotoResult> {
  try {
    const prompt = `To zdjecie opakowania kosmetyku. Jesli widac kod kreskowy, odczytaj cyfry wydrukowane pod nim (EAN/UPC). Odczytaj tez z etykiety: marke, pelna nazwe produktu i kategorie (np. podklad, roz, szminka, tusz do rzes). Odpowiedz WYLACZNIE obiektem JSON, bez zadnego dodatkowego tekstu ani formatowania markdown: {"barcode": "cyfry kodu lub pusty string", "brand": "...", "name": "...", "category": "..."}. Jesli ktoregos pola nie da sie odczytac, zostaw pusty string "".`;
    const text = await callGemini(
      [{ text: prompt }, { inlineData: { mimeType: photo.mimeType, data: photo.base64 } }],
      false
    );
    if (!text) return null;

    const parsed = extractJsonObject<{ barcode?: string; brand?: string; name?: string; category?: string }>(text);
    if (!parsed) return null;
    const barcode = parsed.barcode?.trim() ?? "";
    const brand = parsed.brand?.trim() ?? "";
    const name = parsed.name?.trim() ?? "";
    const category = parsed.category?.trim() ?? "";
    if (barcode || brand || name || category) return { barcode, brand, name, category };
    return null;
  } catch {
    return null;
  }
}

export async function addCalendarEvent(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const time = String(formData.get("time") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!title || !date) throw new Error("Tytul i data sa wymagane.");

  const supabase = getSupabase();
  const { error } = await supabase.from("calendar_events").insert({ title, event_date: date, event_time: time, notes });
  if (error) throw new Error(`Nie udalo sie zapisac wydarzenia: ${error.message}`);

  revalidatePath("/studio/kalendarz");
  redirect(`/studio/kalendarz?month=${date.slice(0, 7)}`);
}

export async function updateCalendarEvent(id: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const time = String(formData.get("time") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!title || !date) throw new Error("Tytul i data sa wymagane.");

  const supabase = getSupabase();
  const { error } = await supabase.from("calendar_events").update({ title, event_date: date, event_time: time, notes }).eq("id", id);
  if (error) throw new Error(`Nie udalo sie zaktualizowac wydarzenia: ${error.message}`);

  revalidatePath("/studio/kalendarz");
  redirect(`/studio/kalendarz?month=${date.slice(0, 7)}`);
}

export async function deleteCalendarEvent(id: string, month: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac wydarzenia: ${error.message}`);

  revalidatePath("/studio/kalendarz");
  redirect(`/studio/kalendarz?month=${month}`);
}
