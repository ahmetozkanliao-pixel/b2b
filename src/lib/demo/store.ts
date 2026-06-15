import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import type { Category, Company, CompanyType, Listing, Message, NewsArticle, Notification, PortfolioItem } from "@/types";
import { isInlineImageData, processLogoField } from "./logo-storage";
import { isInlineImageData as isListingInlineImage, processListingImageField } from "./listing-image-storage";
import { slugify } from "@/lib/utils";
import { DEMO_USERS } from "./config";
import { getDemoDataDir, isDemoMemoryStore } from "./paths";
import { createInitialDemoStore, DEFAULT_DEMO_SETTINGS } from "./seed";
import type { DemoApplication, DemoChatRoom, DemoRegisteredUser, DemoSettings, DemoStore } from "./types";
import type { UserRole } from "@/types";

const DATA_DIR = getDemoDataDir();
const STORE_FILE = path.join(DATA_DIR, "demo-store.json");

const memoryStoreGlobal = globalThis as typeof globalThis & {
  __b2bDemoStore?: DemoStore;
};

function loadInitialStore(): DemoStore {
  const initial = createInitialDemoStore();
  mergeProducerSeedData(initial);
  mergeCategoriesSeed(initial);
  mergeNewsSeedData(initial);
  mergeListingSeedData(initial);
  mergeProfileSeedData(initial);
  mergeShowcaseSeedData(initial);
  migrateInlineLogos(initial);
  migrateInlineListingImages(initial);
  migrateLegacyCategoryIds(initial);
  return initial;
}

function hydrateStore(store: DemoStore): DemoStore {
  if (!store.applications) store.applications = createInitialDemoStore().applications;
  if (!store.chatRooms) store.chatRooms = createInitialDemoStore().chatRooms;
  if (!store.messages) store.messages = createInitialDemoStore().messages;
  if (!store.notifications) store.notifications = createInitialDemoStore().notifications;
  if (!store.companies) store.companies = createInitialDemoStore().companies;
  if (!store.settings) store.settings = createInitialDemoStore().settings;
  if (!store.catalogs) store.catalogs = createInitialDemoStore().catalogs;
  if (!store.portfolio) store.portfolio = createInitialDemoStore().portfolio;
  if (!store.news) store.news = createInitialDemoStore().news;
  if (!store.categories) store.categories = createInitialDemoStore().categories;
  if (!store.registeredUsers) store.registeredUsers = [];

  mergeProducerSeedData(store);
  mergeCategoriesSeed(store);
  mergeNewsSeedData(store);
  mergeListingSeedData(store);
  mergeProfileSeedData(store);
  mergeShowcaseSeedData(store);
  migrateInlineLogos(store);
  migrateInlineListingImages(store);
  migrateLegacyCategoryIds(store);

  return store;
}

function ensureStore(): DemoStore {
  if (memoryStoreGlobal.__b2bDemoStore) {
    return memoryStoreGlobal.__b2bDemoStore;
  }

  if (isDemoMemoryStore()) {
    const initial = loadInitialStore();
    memoryStoreGlobal.__b2bDemoStore = initial;
    return initial;
  }

  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

    if (!existsSync(STORE_FILE)) {
      const initial = loadInitialStore();
      writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
      memoryStoreGlobal.__b2bDemoStore = initial;
      return initial;
    }

    const raw = readFileSync(STORE_FILE, "utf-8");
    const store = hydrateStore(JSON.parse(raw) as DemoStore);
    memoryStoreGlobal.__b2bDemoStore = store;
    return store;
  } catch {
    const initial = loadInitialStore();
    memoryStoreGlobal.__b2bDemoStore = initial;
    return initial;
  }
}

function migrateInlineListingImages(store: DemoStore) {
  let changed = false;

  for (const listing of store.listings) {
    if (!isListingInlineImage(listing.image_url)) continue;
    try {
      listing.image_url = processListingImageField(listing.id, listing.image_url);
      changed = true;
    } catch {
      listing.image_url = null;
      changed = true;
    }
  }

  if (changed) saveStore(store);
}

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  "cat-1": "sub-metal-sheet",
  "cat-2": "sub-plastic-injection",
  "cat-3": "sub-textile-knit",
  "cat-4": "sub-electronics-pcb",
  "cat-5": "sub-food-process",
  "cat-6": "sub-furniture-cabinet",
  "cat-7": "sub-pack-flex",
  "cat-8": "sub-other-general",
};

function migrateLegacyCategoryIds(store: DemoStore) {
  let changed = false;

  for (const listing of store.listings) {
    if (listing.category_id && LEGACY_CATEGORY_MAP[listing.category_id]) {
      listing.category_id = LEGACY_CATEGORY_MAP[listing.category_id];
      listing.category = store.categories.find((c) => c.id === listing.category_id);
      changed = true;
    }
  }

  for (const company of Object.values(store.companies)) {
    if (!company.category_ids?.length) continue;
    const migrated = company.category_ids.map((id) => LEGACY_CATEGORY_MAP[id] || id);
    if (JSON.stringify(migrated) !== JSON.stringify(company.category_ids)) {
      company.category_ids = migrated;
      changed = true;
    }
  }

  if (changed) saveStore(store);
}

function mergeCategoriesSeed(store: DemoStore) {
  const seedCategories = createInitialDemoStore().categories;
  const existingIds = new Set(store.categories.map((c) => c.id));
  let changed = false;

  for (const seed of seedCategories) {
    if (!existingIds.has(seed.id)) {
      store.categories.push(seed);
      changed = true;
    }
  }

  if (changed) saveStore(store);
}

function mergeShowcaseSeedData(store: DemoStore) {
  const initial = createInitialDemoStore();
  for (const [id, seedCompany] of Object.entries(initial.companies)) {
    if (!store.companies[id]) {
      store.companies[id] = seedCompany;
    }
  }
}

function migrateInlineLogos(store: DemoStore) {
  let changed = false;

  for (const [companyId, company] of Object.entries(store.companies)) {
    if (!isInlineImageData(company.logo_url)) continue;

    try {
      company.logo_url = processLogoField(companyId, company.logo_url);
      changed = true;
    } catch {
      company.logo_url = null;
      changed = true;
    }
  }

  if (changed) saveStore(store);
}

function mergeNewsSeedData(store: DemoStore) {
  const initial = createInitialDemoStore();
  for (const article of initial.news) {
    if (!store.news.some((n) => n.id === article.id)) {
      store.news.push(article);
    }
  }
}

function mergeProfileSeedData(store: DemoStore) {
  const initial = createInitialDemoStore();

  for (const [id, seedCompany] of Object.entries(initial.companies)) {
    if (!store.companies[id]) continue;
    const existing = store.companies[id];
    if (!existing.slug && seedCompany.slug) existing.slug = seedCompany.slug;
    if (!existing.tagline && seedCompany.tagline) existing.tagline = seedCompany.tagline;
    if (!existing.cover_image_url && seedCompany.cover_image_url) {
      existing.cover_image_url = seedCompany.cover_image_url;
    }
    if (existing.profile_public === undefined) {
      existing.profile_public = seedCompany.membership_plan === "pro" || existing.type === "demand_owner";
    }
    if (!existing.membership_plan && seedCompany.membership_plan) {
      existing.membership_plan = seedCompany.membership_plan;
    }
    if (existing.type === "producer" && !existing.membership_plan) {
      existing.membership_plan = "free";
    }
  }

  for (const item of initial.portfolio) {
    if (!store.portfolio.some((p) => p.id === item.id)) {
      store.portfolio.push(item);
    }
  }
}

function mergeListingSeedData(store: DemoStore) {
  const initial = createInitialDemoStore();
  for (const listing of initial.listings) {
    if (!store.listings.some((l) => l.id === listing.id)) {
      store.listings.push(listing);
    }
  }
}

const FREE_DEMO_SUPPLIER_COMPANY_ID = "demo-supplier-free-co";

function syncFreeDemoSupplierPlanFromSeed(store: DemoStore) {
  const seedCompany = createInitialDemoStore().companies[FREE_DEMO_SUPPLIER_COMPANY_ID];
  const company = store.companies[FREE_DEMO_SUPPLIER_COMPANY_ID];
  if (!seedCompany || !company) return;

  company.membership_plan = "free";
  company.profile_public = false;
}

function mergeProducerSeedData(store: DemoStore) {
  const initial = createInitialDemoStore();
  const producerCompanyIds = ["producer-003", FREE_DEMO_SUPPLIER_COMPANY_ID];

  for (const producerCompanyId of producerCompanyIds) {
    const seedCompany = initial.companies[producerCompanyId];
    if (!store.companies[producerCompanyId]) {
      store.companies[producerCompanyId] = seedCompany;
    } else if (seedCompany?.category_ids && !store.companies[producerCompanyId].category_ids?.length) {
      store.companies[producerCompanyId].category_ids = seedCompany.category_ids;
    }
  }

  const producerUserIds = ["demo-producer-001", "demo-supplier-free-001"];
  for (const producerUserId of producerUserIds) {
    if (!store.settings[producerUserId]) {
      store.settings[producerUserId] = initial.settings[producerUserId] ?? initial.settings["demo-producer-001"];
    }

    for (const notif of initial.notifications.filter((n) => n.user_id === producerUserId)) {
      if (!store.notifications.some((n) => n.id === notif.id)) {
        store.notifications.push(notif);
      }
    }

    for (const app of initial.applications.filter((a) => a.applicant_id === producerUserId)) {
      if (!store.applications.some((a) => a.id === app.id)) {
        store.applications.push(app);
      }
    }
  }

  for (const room of initial.chatRooms.filter((r) => producerCompanyIds.includes(r.producer_company_id))) {
    if (!store.chatRooms.some((r) => r.id === room.id)) {
      store.chatRooms.push(room);
    }
  }

  for (const room of initial.chatRooms.filter((r) => producerCompanyIds.includes(r.producer_company_id))) {
    for (const msg of initial.messages.filter((m) => m.room_id === room.id)) {
      if (!store.messages.some((m) => m.id === msg.id)) {
        store.messages.push(msg);
      }
    }
  }

  if (!store.catalogs?.length) {
    store.catalogs = initial.catalogs;
  }

  syncFreeDemoSupplierPlanFromSeed(store);

  for (const [id, seedCompany] of Object.entries(initial.companies)) {
    if (!store.companies[id]) {
      store.companies[id] = seedCompany;
    } else if (seedCompany.category_ids?.length && !store.companies[id].category_ids?.length) {
      store.companies[id].category_ids = seedCompany.category_ids;
    }
  }
}

function saveStore(store: DemoStore) {
  memoryStoreGlobal.__b2bDemoStore = store;
  if (isDemoMemoryStore()) return;

  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Yerel dosya yazımı başarısızsa bellek içi kopya kullanılmaya devam eder.
  }
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

// Listings
export function getDemoListings(companyId?: string): Listing[] {
  const store = ensureStore();
  if (!companyId) return store.listings.filter((l) => l.status === "active");
  return store.listings.filter((l) => l.company_id === companyId);
}

export function getDemoListingsForProducer(producerCompanyId: string): Listing[] {
  const store = ensureStore();
  const producer = store.companies[producerCompanyId];
  if (!producer?.category_ids?.length) return [];

  return store.listings.filter(
    (l) =>
      l.status === "active" &&
      l.category_id &&
      producer.category_ids!.includes(l.category_id)
  );
}

export function getDemoListingById(id: string): Listing | null {
  const store = ensureStore();
  const listing = store.listings.find((l) => l.id === id && l.status === "active");
  return listing ?? null;
}

export function getDemoListingForOwner(listingId: string, companyId: string): Listing | null {
  const store = ensureStore();
  const listing = store.listings.find(
    (l) => l.id === listingId && l.company_id === companyId
  );
  return listing ?? null;
}

export function hasDemoApplication(listingId: string, applicantId: string) {
  const store = ensureStore();
  return store.applications.some(
    (a) => a.listing_id === listingId && a.applicant_id === applicantId
  );
}

export function addDemoApplication(application: DemoApplication) {
  const store = ensureStore();
  store.applications.unshift(application);
  saveStore(store);
  return application;
}

export function addDemoListing(listing: Listing) {
  const store = ensureStore();
  store.listings.unshift(listing);
  saveStore(store);
  return listing;
}

export function updateDemoListing(listingId: string, data: Partial<Listing>) {
  const store = ensureStore();
  const index = store.listings.findIndex((l) => l.id === listingId);
  if (index === -1) return null;
  store.listings[index] = { ...store.listings[index], ...data };
  saveStore(store);
  return store.listings[index];
}

// Company
export function getDemoCompany(companyId: string): Company | null {
  const store = ensureStore();
  return store.companies[companyId] ?? null;
}

export function getPublicDemoCompanies(): Company[] {
  const store = ensureStore();
  return Object.values(store.companies);
}

export function resetFreeDemoSupplierPlan() {
  const store = ensureStore();
  syncFreeDemoSupplierPlanFromSeed(store);
  saveStore(store);
  return store.companies[FREE_DEMO_SUPPLIER_COMPANY_ID] ?? null;
}

export function updateDemoCompany(companyId: string, data: Partial<Company>) {
  const store = ensureStore();
  const existing = store.companies[companyId];
  if (!existing) return null;
  store.companies[companyId] = { ...existing, ...data };
  saveStore(store);
  return store.companies[companyId];
}

export function getDemoCompanyBySlug(slug: string): Company | null {
  const store = ensureStore();
  const bySlug = Object.values(store.companies).find((c) => c.slug === slug);
  if (bySlug) return bySlug;
  return store.companies[slug] ?? null;
}

export function getDemoPortfolio(companyId: string): PortfolioItem[] {
  const store = ensureStore();
  return store.portfolio
    .filter((p) => p.company_id === companyId)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function addDemoPortfolioItem(item: PortfolioItem) {
  const store = ensureStore();
  store.portfolio.unshift(item);
  saveStore(store);
  return item;
}

export function updateDemoPortfolioItem(itemId: string, companyId: string, data: Partial<PortfolioItem>) {
  const store = ensureStore();
  const index = store.portfolio.findIndex((p) => p.id === itemId && p.company_id === companyId);
  if (index === -1) return null;
  store.portfolio[index] = { ...store.portfolio[index], ...data };
  saveStore(store);
  return store.portfolio[index];
}

export function deleteDemoPortfolioItem(itemId: string, companyId: string) {
  const store = ensureStore();
  const before = store.portfolio.length;
  store.portfolio = store.portfolio.filter(
    (p) => !(p.id === itemId && p.company_id === companyId)
  );
  if (store.portfolio.length === before) return false;
  saveStore(store);
  return true;
}

// Applications
export function getDemoApplications(companyId: string): DemoApplication[] {
  const store = ensureStore();
  const listingIds = store.listings
    .filter((l) => l.company_id === companyId)
    .map((l) => l.id);
  return store.applications
    .filter((a) => listingIds.includes(a.listing_id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getDemoApplicationById(applicationId: string): DemoApplication | null {
  const store = ensureStore();
  return store.applications.find((a) => a.id === applicationId) ?? null;
}

export function updateDemoApplication(
  applicationId: string,
  data: Partial<DemoApplication>
) {
  const store = ensureStore();
  const index = store.applications.findIndex((a) => a.id === applicationId);
  if (index === -1) return null;

  store.applications[index] = { ...store.applications[index], ...data };
  saveStore(store);
  return store.applications[index];
}

export function closeListingAfterDeal(listingId: string, agreedApplicationId: string) {
  const store = ensureStore();
  const listing = store.listings.find((l) => l.id === listingId);
  if (listing) {
    listing.status = "closed";
  }

  for (const app of store.applications.filter((a) => a.listing_id === listingId)) {
    if (app.id === agreedApplicationId) continue;
    if (app.status === "pending") app.status = "rejected";
    else if (app.status === "approved") app.status = "no_agreement";
  }

  saveStore(store);
  return listing;
}

export function addDemoChatRoom(room: DemoChatRoom) {
  const store = ensureStore();
  store.chatRooms.push(room);
  saveStore(store);
  return room;
}

// Chat
export function getDemoChatRooms(companyId: string, role: "demand_owner" | "producer") {
  const store = ensureStore();
  if (role === "producer") {
    return store.chatRooms.filter((r) => r.producer_company_id === companyId);
  }
  return store.chatRooms.filter((r) => r.demand_company_id === companyId);
}

export function getDemoChatRoom(roomId: string) {
  const store = ensureStore();
  return store.chatRooms.find((r) => r.id === roomId) ?? null;
}

export function getDemoChatRoomByApplicationId(applicationId: string) {
  const store = ensureStore();
  return store.chatRooms.find((r) => r.application_id === applicationId) ?? null;
}

export function getDemoMessages(roomId: string): Message[] {
  const store = ensureStore();
  return store.messages
    .filter((m) => m.room_id === roomId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export interface DemoChatPreview {
  id: string;
  partnerName: string;
  listingTitle: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unread: number;
}

export function getDemoChatPreview(
  companyId: string,
  userId: string,
  role: "demand_owner" | "producer",
  limit = 3
): DemoChatPreview[] {
  const rooms = getDemoChatRooms(companyId, role);

  return rooms
    .map((room) => {
      const messages = getDemoMessages(room.id);
      const last = messages[messages.length - 1];
      const unread = messages.filter((m) => !m.is_read && m.sender_id !== userId).length;
      const partnerName = role === "producer" ? room.demand_company_name : room.producer_name;

      let lastMessage = last?.content ?? null;
      if (!lastMessage && last?.type === "offer") lastMessage = "Teklif gönderildi";
      if (!lastMessage && last?.type === "file") lastMessage = last.file_name || "Dosya gönderildi";

      return {
        id: room.id,
        partnerName,
        listingTitle: room.listing_title,
        lastMessage,
        lastMessageAt: last?.created_at ?? room.created_at,
        unread,
      };
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .slice(0, limit);
}

export function getDemoChatUnreadCount(
  companyId: string,
  userId: string,
  role: "demand_owner" | "producer"
) {
  return getDemoChatRooms(companyId, role).reduce((sum, room) => {
    const unread = getDemoMessages(room.id).filter(
      (m) => !m.is_read && m.sender_id !== userId
    ).length;
    return sum + unread;
  }, 0);
}

export function addDemoMessage(message: Message) {
  const store = ensureStore();
  store.messages.push(message);
  saveStore(store);
  return message;
}

export function markDemoMessagesAsRead(roomId: string, userId: string) {
  const store = ensureStore();
  let changed = false;

  for (const msg of store.messages) {
    if (msg.room_id === roomId && msg.sender_id !== userId && !msg.is_read) {
      msg.is_read = true;
      changed = true;
    }
  }

  if (changed) saveStore(store);
}

// Notifications
export function getDemoNotifications(userId: string): Notification[] {
  const store = ensureStore();
  return store.notifications
    .filter((n) => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function addDemoNotification(notification: Notification) {
  const store = ensureStore();
  store.notifications.unshift(notification);
  saveStore(store);
  return notification;
}

export function notifyMatchingProducersForListing(listing: Listing) {
  if (listing.status !== "active" || !listing.category_id) return 0;

  const store = ensureStore();
  let count = 0;

  for (const company of Object.values(store.companies)) {
    if (company.type !== "producer" || company.status !== "approved") continue;
    if (!company.category_ids?.includes(listing.category_id)) continue;
    if (!company.owner_id) continue;

    addDemoNotification({
      id: createId("notif"),
      user_id: company.owner_id,
      type: "new_listing_match",
      title: "Kategorinize Uygun Yeni İlan",
      message: `"${listing.title}" ilanı üretim kategorilerinize uygun.`,
      link: `/ilanlar/${listing.id}`,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    count += 1;
  }

  return count;
}

export function markDemoNotificationRead(notificationId: string, userId: string) {
  const store = ensureStore();
  const notif = store.notifications.find(
    (n) => n.id === notificationId && n.user_id === userId
  );
  if (!notif) return null;
  notif.is_read = true;
  saveStore(store);
  return notif;
}

export function markAllDemoNotificationsRead(userId: string) {
  const store = ensureStore();
  store.notifications
    .filter((n) => n.user_id === userId)
    .forEach((n) => { n.is_read = true; });
  saveStore(store);
}

// Settings
export function getDemoSettings(userId: string): DemoSettings {
  const store = ensureStore();
  return store.settings[userId] ?? createInitialDemoStore().settings[userId];
}

export function updateDemoSettings(userId: string, data: Partial<DemoSettings>) {
  const store = ensureStore();
  store.settings[userId] = { ...getDemoSettings(userId), ...data };
  saveStore(store);
  return store.settings[userId];
}

export function getDemoApplicationsByApplicant(userId: string) {
  const store = ensureStore();
  return store.applications
    .filter((a) => a.applicant_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getDemoMonthlyApplicationCount(userId: string): number {
  const store = ensureStore();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return store.applications.filter(
    (a) =>
      a.applicant_id === userId &&
      new Date(a.created_at) >= monthStart
  ).length;
}

export function getDemoCatalogs(companyId: string) {
  const store = ensureStore();
  return store.catalogs.filter((c) => c.company_id === companyId);
}

// News
export function getDemoNews(): NewsArticle[] {
  const store = ensureStore();
  return store.news
    .filter((n) => n.is_published !== false)
    .sort(
      (a, b) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    );
}

export function getAllDemoNews(): NewsArticle[] {
  const store = ensureStore();
  return store.news.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getDemoNewsBySlug(slug: string): NewsArticle | null {
  const store = ensureStore();
  const article = store.news.find((n) => n.slug === slug && n.is_published !== false);
  return article ?? null;
}

export function addDemoNews(article: NewsArticle) {
  const store = ensureStore();
  store.news.unshift(article);
  saveStore(store);
  return article;
}

export function deleteDemoNews(id: string) {
  const store = ensureStore();
  const before = store.news.length;
  store.news = store.news.filter((n) => n.id !== id);
  if (store.news.length === before) return false;
  saveStore(store);
  return true;
}

// Categories
export function getDemoCategories(): Category[] {
  const store = ensureStore();
  return [...store.categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function syncListingCategoryRefs(store: DemoStore, categoryId: string) {
  const category = store.categories.find((c) => c.id === categoryId);
  if (!category) return;

  for (const listing of store.listings) {
    if (listing.category_id === categoryId) {
      listing.category = category;
    }
  }
}

function isCategoryInUse(store: DemoStore, id: string): string | null {
  if (store.listings.some((l) => l.category_id === id)) {
    return "Bu kategori ilanlarda kullanılıyor.";
  }
  if (Object.values(store.companies).some((c) => c.category_ids?.includes(id))) {
    return "Bu kategori firmalarda kullanılıyor.";
  }
  return null;
}

export function addDemoCategory(data: {
  name: string;
  slug?: string;
  parent_id?: string | null;
}): { ok: true; category: Category } | { ok: false; error: string } {
  const store = ensureStore();
  const name = data.name.trim();
  if (!name) return { ok: false, error: "Kategori adı zorunludur." };

  const slug = (data.slug?.trim() || slugify(name)).toLowerCase();
  if (store.categories.some((c) => c.slug === slug)) {
    return { ok: false, error: "Bu slug zaten kullanılıyor." };
  }

  if (data.parent_id) {
    const parent = store.categories.find((c) => c.id === data.parent_id);
    if (!parent || parent.parent_id) {
      return { ok: false, error: "Geçerli bir ana kategori seçin." };
    }
  }

  const category: Category = {
    id: createId(data.parent_id ? "sub" : "main"),
    name,
    slug,
    icon: null,
    parent_id: data.parent_id || null,
    sort_order: store.categories.length,
    is_active: true,
  };

  store.categories.push(category);
  saveStore(store);
  return { ok: true, category };
}

export function updateDemoCategory(
  id: string,
  data: { name?: string; slug?: string; parent_id?: string | null }
): { ok: true; category: Category } | { ok: false; error: string } {
  const store = ensureStore();
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) return { ok: false, error: "Kategori bulunamadı." };

  const current = store.categories[index];

  if (data.name !== undefined) {
    const name = data.name.trim();
    if (!name) return { ok: false, error: "Kategori adı zorunludur." };
    current.name = name;
  }

  if (data.slug !== undefined) {
    const slug = data.slug.trim().toLowerCase();
    if (!slug) return { ok: false, error: "Slug zorunludur." };
    if (store.categories.some((c) => c.slug === slug && c.id !== id)) {
      return { ok: false, error: "Bu slug zaten kullanılıyor." };
    }
    current.slug = slug;
  }

  if (data.parent_id !== undefined) {
    if (data.parent_id === id) {
      return { ok: false, error: "Kategori kendi alt kategorisi olamaz." };
    }
    if (data.parent_id) {
      const parent = store.categories.find((c) => c.id === data.parent_id);
      if (!parent || parent.parent_id) {
        return { ok: false, error: "Geçerli bir ana kategori seçin." };
      }
      if (store.categories.some((c) => c.parent_id === id)) {
        return { ok: false, error: "Alt kategorisi olan bir kategori, alt kategori yapılamaz." };
      }
      current.parent_id = data.parent_id;
    } else {
      current.parent_id = null;
    }
  }

  store.categories[index] = current;
  syncListingCategoryRefs(store, id);
  saveStore(store);
  return { ok: true, category: current };
}

export function deleteDemoCategory(
  id: string
): { ok: true } | { ok: false; error: string } {
  const store = ensureStore();
  const category = store.categories.find((c) => c.id === id);
  if (!category) return { ok: false, error: "Kategori bulunamadı." };

  if (store.categories.some((c) => c.parent_id === id)) {
    return { ok: false, error: "Önce alt kategorileri silmelisiniz." };
  }

  const inUse = isCategoryInUse(store, id);
  if (inUse) return { ok: false, error: inUse };

  store.categories = store.categories.filter((c) => c.id !== id);
  saveStore(store);
  return { ok: true };
}

// Stats
export function getDemoDashboardStats(
  companyId: string,
  userId: string,
  role: "demand_owner" | "producer" = "demand_owner"
) {
  const notifications = getDemoNotifications(userId);
  const rooms = getDemoChatRooms(companyId, role);

  if (role === "producer") {
    const myApps = getDemoApplicationsByApplicant(userId);
    const activeListings = getDemoListingsForProducer(companyId).length;
    return {
      activeListings,
      pendingApplications: myApps.filter((a) => a.status === "pending").length,
      approvedApplications: myApps.filter((a) => a.status === "approved").length,
      activeChats: rooms.length,
      unreadNotifications: notifications.filter((n) => !n.is_read).length,
    };
  }

  const applications = getDemoApplications(companyId);
  const listings = getDemoListings(companyId);

  return {
    activeListings: listings.filter((l) => l.status === "active").length,
    pendingApplications: applications.filter((a) => a.status === "pending").length,
    approvedApplications: 0,
    activeChats: rooms.length,
    unreadNotifications: notifications.filter((n) => !n.is_read).length,
  };
}

export function getDemoAdminStats() {
  const store = ensureStore();
  const companies = Object.values(store.companies).filter((c) => c.id !== "admin-company-001");

  return {
    totalCompanies: companies.length,
    pendingCompanies: companies.filter((c) => c.status === "pending").length,
    approvedCompanies: companies.filter((c) => c.status === "approved").length,
    demandOwners: companies.filter((c) => c.type === "demand_owner").length,
    producers: companies.filter((c) => c.type === "producer").length,
    totalListings: store.listings.length,
    activeListings: store.listings.filter((l) => l.status === "active").length,
    closedListings: store.listings.filter((l) => l.status === "closed").length,
    totalApplications: store.applications.length,
    pendingApplications: store.applications.filter((a) => a.status === "pending").length,
    totalNews: store.news.length,
    publishedNews: store.news.filter((n) => n.is_published !== false).length,
    totalMessages: store.messages.length,
    activeChats: store.chatRooms.length,
  };
}

export function getAllDemoCompaniesAdmin(): Company[] {
  const store = ensureStore();
  return Object.values(store.companies)
    .filter((c) => c.id !== "admin-company-001")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getAllDemoListingsAdmin(): Listing[] {
  const store = ensureStore();
  return [...store.listings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function findRegisteredDemoUserByEmail(email: string): DemoRegisteredUser | null {
  const store = ensureStore();
  return (
    store.registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export function getRegisteredDemoUserById(id: string): DemoRegisteredUser | null {
  const store = ensureStore();
  return store.registeredUsers.find((u) => u.id === id) ?? null;
}

export function getRegisteredDemoUserByToken(token: string): DemoRegisteredUser | null {
  const store = ensureStore();
  return store.registeredUsers.find((u) => u.verification_token === token) ?? null;
}

export function registerDemoUser(input: {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  company_name: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  city: string;
  tax_number: string;
  national_id: string;
  category_ids: string[];
  verification_token: string;
}): DemoRegisteredUser {
  const store = ensureStore();
  const normalizedEmail = input.email.toLowerCase().trim();

  if (DEMO_USERS.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("Bu e-posta adresi zaten kayıtlı.");
  }
  if (store.registeredUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("Bu e-posta adresi zaten kayıtlı.");
  }

  const userId = createId("user");
  const companyId = createId("company");
  const now = new Date().toISOString();

  const company: Company = {
    id: companyId,
    owner_id: userId,
    name: input.company_name.trim(),
    type: input.role as CompanyType,
    status: "pending",
    description: null,
    logo_url: null,
    website: input.website.trim(),
    tax_number: input.tax_number.trim(),
    address: input.address.trim(),
    city: input.city.trim(),
    country: input.country.trim(),
    phone: input.phone.trim(),
    email: normalizedEmail,
    verified: false,
    category_ids: input.category_ids,
    slug: slugify(input.company_name),
    created_at: now,
  };

  const user: DemoRegisteredUser = {
    id: userId,
    email: normalizedEmail,
    password: input.password,
    full_name: input.full_name.trim(),
    role: input.role,
    company_id: companyId,
    national_id: input.national_id.trim(),
    email_verified: false,
    verification_token: input.verification_token,
    created_at: now,
  };

  store.companies[companyId] = company;
  store.registeredUsers.push(user);
  store.settings[userId] = { ...DEFAULT_DEMO_SETTINGS };
  saveStore(store);

  return user;
}

export function verifyRegisteredDemoUser(token: string): DemoRegisteredUser | null {
  const store = ensureStore();
  const user = store.registeredUsers.find((u) => u.verification_token === token);
  if (!user) return null;

  user.email_verified = true;
  user.verification_token = "";
  saveStore(store);
  return user;
}
