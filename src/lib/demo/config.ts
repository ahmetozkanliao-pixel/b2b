import type { Category, Company, Listing, UserRole } from "@/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function isDemoMode() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return (
    process.env.DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
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

export const DEMO_PRODUCER_FREE_USER = {
  id: "demo-supplier-free-001",
  email: "demo@tedarikci.com",
  password: "Tedarikci2026!",
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
    id: DEMO_PRODUCER_FREE_USER.id,
    email: DEMO_PRODUCER_FREE_USER.email,
    password: DEMO_PRODUCER_FREE_USER.password,
    full_name: "Ayşe Demir",
    role: "producer",
    company: {
      id: "demo-supplier-free-co",
      owner_id: DEMO_PRODUCER_FREE_USER.id,
      name: "Ege Tekstil Tedarik",
      type: "producer",
      status: "approved",
      description:
        "Tekstil ve konfeksiyon tedarikinde B2B çözümler sunuyoruz. Ücretsiz planda aylık 10 ilana teklif verebilir, Pro ile sınırsız erişim ve profil sayfası açabilirsiniz.",
      category_ids: ["sub-textile-knit", "sub-textile-dye"],
      logo_url: null,
      website: "https://ege-tekstil-tedarik.com",
      tax_number: "1122334455",
      address: "Organize Sanayi Bölgesi, Denizli",
      city: "Denizli",
      phone: "+90 258 000 00 00",
      email: DEMO_PRODUCER_FREE_USER.email,
      verified: false,
      slug: "ege-tekstil-tedarik",
      tagline: "Tekstil tedarik ortağınız",
      cover_image_url: null,
      founded_year: 2018,
      employee_count: "10-50",
      profile_public: false,
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
      category_ids: ["sub-metal-cnc", "sub-metal-sheet"],
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
  { id: "main-metal", name: "Metal & Çelik", slug: "metal-celik", icon: null, parent_id: null },
  { id: "main-plastic", name: "Plastik & Polimer", slug: "plastik-polimer", icon: null, parent_id: null },
  { id: "main-textile", name: "Tekstil", slug: "tekstil", icon: null, parent_id: null },
  { id: "main-electronics", name: "Elektronik", slug: "elektronik", icon: null, parent_id: null },
  { id: "main-food", name: "Gıda", slug: "gida", icon: null, parent_id: null },
  { id: "main-furniture", name: "Mobilya & Ahşap", slug: "mobilya-ahsap", icon: null, parent_id: null },
  { id: "main-packaging", name: "Ambalaj", slug: "ambalaj", icon: null, parent_id: null },
  { id: "main-other", name: "Diğer", slug: "diger", icon: null, parent_id: null },
  { id: "sub-metal-cnc", name: "CNC İşleme", slug: "cnc-isleme", icon: null, parent_id: "main-metal" },
  { id: "sub-metal-weld", name: "Kaynak & Montaj", slug: "kaynak-montaj", icon: null, parent_id: "main-metal" },
  { id: "sub-metal-sheet", name: "Sac Metal İşleme", slug: "sac-metal", icon: null, parent_id: "main-metal" },
  { id: "sub-plastic-injection", name: "Enjeksiyon Kalıp", slug: "enjeksiyon-kalip", icon: null, parent_id: "main-plastic" },
  { id: "sub-plastic-extrusion", name: "Ekstrüzyon", slug: "ekstruzyon", icon: null, parent_id: "main-plastic" },
  { id: "sub-textile-knit", name: "Örme & Dokuma", slug: "orme-dokuma", icon: null, parent_id: "main-textile" },
  { id: "sub-textile-dye", name: "Boya & Apre", slug: "boya-apre", icon: null, parent_id: "main-textile" },
  { id: "sub-electronics-pcb", name: "PCB Montaj", slug: "pcb-montaj", icon: null, parent_id: "main-electronics" },
  { id: "sub-electronics-cable", name: "Kablo & Harness", slug: "kablo-harness", icon: null, parent_id: "main-electronics" },
  { id: "sub-food-process", name: "Gıda İşleme", slug: "gida-isleme", icon: null, parent_id: "main-food" },
  { id: "sub-food-pack", name: "Gıda Ambalaj", slug: "gida-ambalaj", icon: null, parent_id: "main-food" },
  { id: "sub-furniture-cabinet", name: "Mobilya Üretimi", slug: "mobilya-uretimi", icon: null, parent_id: "main-furniture" },
  { id: "sub-furniture-wood", name: "Ahşap İşleme", slug: "ahsap-isleme", icon: null, parent_id: "main-furniture" },
  { id: "sub-pack-flex", name: "Esnek Ambalaj", slug: "esnek-ambalaj", icon: null, parent_id: "main-packaging" },
  { id: "sub-pack-rigid", name: "Sert Ambalaj", slug: "sert-ambalaj", icon: null, parent_id: "main-packaging" },
  { id: "sub-other-general", name: "Genel Üretim", slug: "genel-uretim", icon: null, parent_id: "main-other" },
];

export const DEMO_LISTINGS_SEED: Listing[] = [
  {
    id: "listing-demo-001",
    company_id: "demo-company-001",
    category_id: "sub-metal-sheet",
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
    category: DEMO_CATEGORIES.find((c) => c.id === "sub-metal-sheet"),
  },
  {
    id: "listing-demo-002",
    company_id: "demo-company-001",
    category_id: "sub-plastic-injection",
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
    category: DEMO_CATEGORIES.find((c) => c.id === "sub-plastic-injection"),
  },
];
