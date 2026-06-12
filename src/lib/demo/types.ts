import type { Application, Category, Company, Message, Notification, NewsArticle, PortfolioItem } from "@/types";

export interface DemoProducer {
  id: string;
  name: string;
  city: string;
}

export interface DemoApplication extends Application {
  listing_title: string;
  producer_name: string;
  producer_city: string;
}

export interface DemoChatRoom {
  id: string;
  application_id: string;
  listing_id: string;
  listing_title: string;
  demand_company_id: string;
  demand_company_name: string;
  producer_company_id: string;
  producer_name: string;
  created_at: string;
}

export interface DemoCatalog {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  file_name: string;
  created_at: string;
}

export interface DemoSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  application_alerts: boolean;
  message_alerts: boolean;
  language: string;
}

export interface DemoStore {
  listings: import("@/types").Listing[];
  applications: DemoApplication[];
  chatRooms: DemoChatRoom[];
  messages: Message[];
  notifications: Notification[];
  companies: Record<string, Company>;
  settings: Record<string, DemoSettings>;
  catalogs: DemoCatalog[];
  portfolio: PortfolioItem[];
  news: NewsArticle[];
  categories: Category[];
}
