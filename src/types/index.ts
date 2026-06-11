export type UserRole = "demand_owner" | "producer" | "admin";
export type CompanyType = "demand_owner" | "producer";
export type CompanyStatus = "pending" | "approved" | "rejected" | "suspended";
export type ListingStatus = "draft" | "active" | "closed" | "cancelled";
export type ApplicationStatus = "pending" | "approved" | "rejected" | "withdrawn";
export type MessageType = "text" | "file" | "image" | "pdf" | "offer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  type: CompanyType;
  status: CompanyStatus;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  tax_number: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  verified: boolean;
  category_ids?: string[];
  slug?: string | null;
  tagline?: string | null;
  cover_image_url?: string | null;
  founded_year?: number | null;
  employee_count?: string | null;
  profile_public?: boolean;
  membership_plan?: "free" | "pro";
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  year: number | null;
  client_name: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface Listing {
  id: string;
  company_id: string;
  category_id: string | null;
  title: string;
  description: string;
  technical_details: string | null;
  budget_min: number | null;
  budget_max: number | null;
  delivery_time: string | null;
  city: string | null;
  application_deadline: string | null;
  status: ListingStatus;
  view_count: number;
  created_at: string;
  category?: Category;
  company?: Company;
}

export interface Application {
  id: string;
  listing_id: string;
  producer_company_id: string;
  applicant_id: string;
  cover_letter: string | null;
  proposed_budget: number | null;
  proposed_delivery: string | null;
  status: ApplicationStatus;
  created_at: string;
  listing?: Listing;
  producer_company?: Company;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  type: MessageType;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  offer_amount: number | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
  is_published?: boolean;
  author_name?: string | null;
}

export interface MembershipPackage {
  id: string;
  name: string;
  slug: string;
  company_type: CompanyType;
  plan: string;
  price_monthly: number;
  price_yearly: number;
  listing_limit: number | null;
  application_limit: number | null;
  features: string[];
}
