import type { Category, Company, Listing, UserRole } from "@/types";

export function isDemoMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    process.env.DEMO_MODE === "true" ||
    url.includes("placeholder") ||
    key.includes("placeholder")
  );
}

export const DEMO_SESSION_COOKIE = "b2b_demo_session";

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  company: Company;
}

export const DEMO_DEMAND_USER = {
  id: "demo-demand-001",
  email: "demo@talep.com",
  password: "Talep2026!",
} as const;

export const DEMO_PRODUCER_USER = {
  id: "demo-producer-001",
  email: "demo@uretici.com",
  password: "Uretici2026!",
} as const;

export const DEMO_ADMIN_USER = {
  id: "demo-admin-001",
  email: "demo@admin.com",
  password: "Admin2026!",
} as const;

export const DEMO_USERS: DemoUser[] = [
  {
    id: DEMO_DEMAND_USER.id,
    email: DEMO_DEMAND_USER.email,
    password: DEMO_DEMAND_USER.password,
    full_name: "Ahmet Yılmaz",
    role: "demand_owner",
    company: {
      id: "demo-company-001",
      owner_id: "demo-demand-001",
      name: "Demo Kurumsal A.Ş.",
      type: "demand_owner",
      status: "approved",
      description:
        "İstanbul merkezli kurumsal firma. Metal, plastik ve tekstil alanlarında üretim tedariki yönetiyoruz. 15 yıllık tedarik deneyimimizle güvenilir iş ortaklıkları kuruyoruz.",
      logo_url: null,
      website: "https://demo-kurumsal.com",
      tax_number: "1234567890",
      address: "Maslak, İstanbul",
      city: "İstanbul",
      phone: "+90 212 000 00 00",
      email: "demo@talep.com",
      verified: true,
      slug: "demo-kurumsal",
      tagline: "Güvenilir tedarik yönetimi",
      cover_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
      founded_year: 2010,
      employee_count: "100-250",
      profile_public: true,
      membership_plan: "free",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: DEMO_PRODUCER_USER.id,
    email: DEMO_PRODUCER_USER.email,
    password: DEMO_PRODUCER_USER.password,
    full_name: "Mehmet Kaya",
    role: "producer",
    company: {
      id: "producer-003",
      owner_id: "demo-producer-001",
      name: "Marmara Metal San.",
      type: "producer",
      status: "approved",
      description:
        "Paslanmaz çelik ve metal işleme alanında 20 yıllık deneyim. ISO 9001 sertifikalı tesisimizde CNC torna, kaynak ve yüzey işleme hizmetleri sunuyoruz.",
      category_ids: ["cat-1"],
      logo_url: null,
      website: "https://marmara-metal.com",
      tax_number: "9876543210",
      address: "Tuzla Organize Sanayi, İstanbul",
      city: "İstanbul",
      phone: "+90 216 000 00 00",
      email: "demo@uretici.com",
      verified: true,
      slug: "marmara-metal",
      tagline: "Metal işlemede 20 yıllık uzmanlık",
      cover_image_url: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=400&fit=crop",
      founded_year: 2004,
      employee_count: "50-100",
      profile_public: true,
      membership_plan: "pro",
      created_at: new Date().toISOString(),
    },
  },
  {
    id: DEMO_ADMIN_USER.id,
    email: DEMO_ADMIN_USER.email,
    password: DEMO_ADMIN_USER.password,
    full_name: "Admin Kullanıcı",
    role: "admin",
    company: {
      id: "admin-company-001",
      owner_id: DEMO_ADMIN_USER.id,
      name: "Platform Yönetimi",
      type: "demand_owner",
      status: "approved",
      description: "Platform yönetim hesabı",
      logo_url: null,
      website: null,
      tax_number: null,
      address: null,
      city: "İstanbul",
      phone: null,
      email: DEMO_ADMIN_USER.email,
      verified: true,
      created_at: new Date().toISOString(),
    },
  },
];

export const DEMO_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Metal / Çelik İşleme", slug: "metal-isleme", icon: null },
  { id: "cat-2", name: "Plastik Enjeksiyon", slug: "plastik-enjeksiyon", icon: null },
  { id: "cat-3", name: "Tekstil Üretimi", slug: "tekstil-uretimi", icon: null },
  { id: "cat-4", name: "Elektronik Montaj", slug: "elektronik-montaj", icon: null },
  { id: "cat-5", name: "Gıda Üretimi", slug: "gida-uretimi", icon: null },
  { id: "cat-6", name: "Mobilya Üretimi", slug: "mobilya-uretimi", icon: null },
  { id: "cat-7", name: "Ambalaj", slug: "ambalaj", icon: null },
  { id: "cat-8", name: "Diğer", slug: "diger", icon: null },
];

export const DEMO_LISTINGS_SEED: Listing[] = [
  {
    id: "listing-demo-001",
    company_id: "demo-company-001",
    category_id: "cat-1",
    title: "Paslanmaz Çelik Boru Üretimi",
    description: "Endüstriyel tesis için 500 adet paslanmaz çelik boru üretimi talep edilmektedir.",
    technical_details: "AISI 304, çap 50mm, et kalınlığı 2mm",
    budget_min: 50000,
    budget_max: 150000,
    delivery_time: "30 gün",
    city: "İstanbul",
    application_deadline: "2026-08-01",
    status: "active",
    view_count: 12,
    created_at: new Date().toISOString(),
    category: DEMO_CATEGORIES[0],
  },
  {
    id: "listing-demo-002",
    company_id: "demo-company-001",
    category_id: "cat-2",
    title: "Plastik Enjeksiyon Kalıp Üretimi",
    description: "Elektronik kutu için plastik enjeksiyon kalıbı üretimi talep edilmektedir.",
    technical_details: "ABS malzeme, 200x150x80mm",
    budget_min: 25000,
    budget_max: 80000,
    delivery_time: "45 gün",
    city: "Bursa",
    application_deadline: "2026-09-01",
    status: "active",
    view_count: 8,
    created_at: new Date().toISOString(),
    category: DEMO_CATEGORIES[1],
  },
];
