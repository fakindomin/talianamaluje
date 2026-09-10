export type Project = {
  id: string;
  slug: string;
  title: string;
  style: string;
  dateLabel: string;
  description: string;
  cover: string;
  coverAlt: string;
  ratio: "portrait" | "square" | "landscape";
  products: string[];
  public: boolean;
};

export const artist = {
  slug: "nina-kaminska",
  displayName: "Nina Kaminska",
  brandName: "talianamaluje",
  city: "Warszawa",
  serviceArea: "Warszawa i okolice",
  bio: "Makijaz editorialowy, slubny i sesyjny z naciskiem na swieza skore, detal i spokojna prace na planie.",
  avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  avatarAlt: "Portret makijazystki w naturalnym swietle",
  specialties: ["Editorial", "Bridal", "Soft glam", "Beauty shoot"]
};

export const projects: Project[] = [
  { id: "p1", slug: "artystyczny", title: "Artystyczny", style: "Editorial glow", dateLabel: "wrzesien 2026", description: "Swietlista skora, chlodny roz i graficzna kreska zbudowane pod bliskie kadry beauty.", cover: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80", coverAlt: "Modelka z delikatnym makijazem beauty", ratio: "portrait", products: ["Skin veil", "Cream blush", "Graphite liner"], public: true },
  { id: "p2", slug: "wieczorowy", title: "Wieczorowy", style: "Evening", dateLabel: "sierpien 2026", description: "Satynowe usta i miekkie oko do wieczorowej stylizacji, bez ciezkiego konturu.", cover: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80", coverAlt: "Zblizenie makijazu oka i ust", ratio: "portrait", products: ["Satin lipstick", "Warm taupe palette"], public: true },
  { id: "p3", slug: "slubny", title: "Slubny", style: "Bridal", dateLabel: "lipiec 2026", description: "Trwaly makijaz slubny utrzymany w czystej, nowoczesnej estetyce.", cover: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80", coverAlt: "Panna mloda w subtelnym makijazu", ratio: "portrait", products: ["Longwear base", "Waterproof mascara"], public: true },
  { id: "p4", slug: "nude", title: "Nude", style: "Soft glam", dateLabel: "czerwiec 2026", description: "Rozswietlony soft glam z roznymi tonami rozu na policzku i powiece.", cover: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80", coverAlt: "Kosmetyki i pedzle ulozone na stole", ratio: "portrait", products: ["Rose pigment", "Glass highlighter"], public: true }
];

export const studioStats = { privateProjects: 7, publishedProjects: 4, cosmetics: 38, models: 12, packingProgress: "8/17" };
export const cosmetics = [
  { name: "Skin Veil 03", brand: "Luma", type: "Podklad", usedIn: 3 },
  { name: "Cream Blush Fig", brand: "Atelier", type: "Roz", usedIn: 5 },
  { name: "Graphite Ink", brand: "Linework", type: "Eyeliner", usedIn: 2 }
];
