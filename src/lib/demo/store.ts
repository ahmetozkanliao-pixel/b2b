import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import type { Company, Listing, Message, NewsArticle, Notification, PortfolioItem } from "@/types";
import { createInitialDemoStore } from "./seed";
import type { DemoApplication, DemoChatRoom, DemoSettings, DemoStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "demo-store.json");

function ensureStore(): DemoStore {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  if (!existsSync(STORE_FILE)) {
    const initial = createInitialDemoStore();
    writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  const raw = readFileSync(STORE_FILE, "utf-8");
  const store = JSON.parse(raw) as DemoStore;

  // Eski store dosyalarına yeni alanları ekle
  if (!store.applications) store.applications = createInitialDemoStore().applications;
  if (!store.chatRooms) store.chatRooms = createInitialDemoStore().chatRooms;
  if (!store.messages) store.messages = createInitialDemoStore().messages;
  if (!store.notifications) store.notifications = createInitialDemoStore().notifications;
  if (!store.companies) store.companies = createInitialDemoStore().companies;
  if (!store.settings) store.settings = createInitialDemoStore().settings;
  if (!store.catalogs) store.catalogs = createInitialDemoStore().catalogs;
  if (!store.portfolio) store.portfolio = createInitialDemoStore().portfolio;
  if (!store.news) store.news = createInitialDemoStore().news;

  mergeProducerSeedData(store);
  mergeNewsSeedData(store);
  mergeListingSeedData(store);
  mergeProfileSeedData(store);

  return store;
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

function mergeProducerSeedData(store: DemoStore) {
  const initial = createInitialDemoStore();
  const producerCompanyId = "producer-003";

  const seedCompany = initial.companies[producerCompanyId];
  if (!store.companies[producerCompanyId]) {
    store.companies[producerCompanyId] = seedCompany;
  } else if (seedCompany?.category_ids && !store.companies[producerCompanyId].category_ids?.length) {
    store.companies[producerCompanyId].category_ids = seedCompany.category_ids;
  }

  const producerUserId = "demo-producer-001";
  if (!store.settings[producerUserId]) {
    store.settings[producerUserId] = initial.settings[producerUserId];
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

  for (const room of initial.chatRooms.filter((r) => r.producer_company_id === producerCompanyId)) {
    if (!store.chatRooms.some((r) => r.id === room.id)) {
      store.chatRooms.push(room);
    }
  }

  if (!store.catalogs?.length) {
    store.catalogs = initial.catalogs;
  }

  for (const [id, seedCompany] of Object.entries(initial.companies)) {
    if (!store.companies[id]) {
      store.companies[id] = seedCompany;
    } else if (seedCompany.category_ids?.length && !store.companies[id].category_ids?.length) {
      store.companies[id].category_ids = seedCompany.category_ids;
    }
  }
}

function saveStore(store: DemoStore) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
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

// Company
export function getDemoCompany(companyId: string): Company | null {
  const store = ensureStore();
  return store.companies[companyId] ?? null;
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

export function getDemoMessages(roomId: string): Message[] {
  const store = ensureStore();
  return store.messages
    .filter((m) => m.room_id === roomId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function addDemoMessage(message: Message) {
  const store = ensureStore();
  store.messages.push(message);
  saveStore(store);
  return message;
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
