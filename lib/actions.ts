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

export async function addProject(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const style = String(formData.get("style") || "").trim();
  const dateLabel = String(formData.get("dateLabel") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const productsRaw = String(formData.get("products") || "").trim();
  const isPublic = formData.get("isPublic") === "on";
  const file = formData.get("cover") as File | null;

  if (!title || !file || file.size === 0) {
    throw new Error("Tytul i zdjecie sa wymagane.");
  }

  const coverUrl = await uploadCover(file, "projects");
  const products = productsRaw ? productsRaw.split(",").map((p) => p.trim()).filter(Boolean) : [];
  const slug = slugify(title);

  const supabase = getSupabase();
  const { error } = await supabase.from("projects").insert({
    slug,
    title,
    style: style || "Bez kategorii",
    date_label: dateLabel || new Date().toLocaleDateString("pl-PL", { month: "long", year: "numeric" }),
    description,
    cover_url: coverUrl,
    cover_alt: title,
    products,
    is_public: isPublic
  });
  if (error) throw new Error(`Nie udalo sie zapisac projektu: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/tematyczne");
  revalidatePath("/@nina-kaminska");
  revalidatePath("/studio");
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
