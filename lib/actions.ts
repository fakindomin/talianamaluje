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

async function uploadCover(file: File, folder: "projects" | "models") {
  const supabase = getSupabase();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false
  });
  if (error) throw new Error(`Upload zdjecia nie powiodl sie: ${error.message}`);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

async function uploadPhotos(files: File[], folder: "projects" | "models") {
  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    urls.push(await uploadCover(file, folder));
  }
  return urls;
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

export async function addProject(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const style = String(formData.get("style") || "").trim();
  const dateLabel = String(formData.get("dateLabel") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const productsRaw = String(formData.get("products") || "").trim();
  const isPublic = formData.get("isPublic") === "on";
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!title || files.length === 0) {
    throw new Error("Tytul i przynajmniej jedno zdjecie sa wymagane.");
  }

  const photoUrls = await uploadPhotos(files, "projects");
  const modelId = await resolveModelId(formData, photoUrls[0]);
  const products = productsRaw ? productsRaw.split(",").map((p) => p.trim()).filter(Boolean) : [];
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
    products,
    is_public: isPublic,
    model_id: modelId
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
  const file = formData.get("cover") as File | null;

  if (!name || !file || file.size === 0) {
    throw new Error("Imie i zdjecie sa wymagane.");
  }

  const coverUrl = await uploadCover(file, "models");

  const supabase = getSupabase();
  const { error } = await supabase.from("models").insert({
    name,
    cover_url: coverUrl,
    cover_alt: `Portret modelki ${name}`
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
  const productsRaw = String(formData.get("products") || "").trim();
  const isPublic = formData.get("isPublic") === "on";
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!title) throw new Error("Tytul jest wymagany.");

  const products = productsRaw ? productsRaw.split(",").map((p) => p.trim()).filter(Boolean) : [];
  const update: Record<string, unknown> = {
    title,
    style: style || "Bez kategorii",
    date_label: dateLabel,
    description,
    products,
    is_public: isPublic
  };

  const supabase = getSupabase();

  if (files.length > 0) {
    const newUrls = await uploadPhotos(files, "projects");
    const { data: existing } = await supabase.from("projects").select("photo_urls").eq("id", id).maybeSingle();
    const combined = [...(existing?.photo_urls ?? []), ...newUrls];
    update.photo_urls = combined;
    update.cover_url = combined[0];
    update.cover_alt = title;
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
  const file = formData.get("cover") as File | null;

  if (!name) throw new Error("Imie jest wymagane.");

  const update: Record<string, unknown> = { name, cover_alt: `Portret modelki ${name}` };
  if (file && file.size > 0) {
    update.cover_url = await uploadCover(file, "models");
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("models").update(update).eq("id", id);
  if (error) throw new Error(`Nie udalo sie zaktualizowac modelki: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath("/studio/modelki");
  redirect("/studio/modelki");
}

export async function deleteModel(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("models").delete().eq("id", id);
  if (error) throw new Error(`Nie udalo sie usunac modelki: ${error.message}`);

  revalidatePath("/modelki");
  revalidatePath("/studio/modelki");
  redirect("/studio/modelki");
}
