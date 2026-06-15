export interface RegistrationPayload {
  email: string;
  password: string;
  full_name: string;
  role: "demand_owner" | "producer";
  company_name: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  city: string;
  tax_number: string;
  national_id: string;
  category_ids: string[];
}

export function validateRegistrationPayload(body: Partial<RegistrationPayload>): string | null {
  const email = body.email?.trim();
  const password = body.password;
  const company_name = body.company_name?.trim();
  const phone = body.phone?.trim();
  const website = body.website?.trim();
  const address = body.address?.trim();
  const country = body.country?.trim();
  const city = body.city?.trim();
  const tax_number = body.tax_number?.replace(/\s/g, "") ?? "";
  const category_ids = Array.isArray(body.category_ids) ? body.category_ids.filter(Boolean) : [];

  if (!email || !password || !company_name) {
    return "Tüm zorunlu alanları doldurun.";
  }
  if (!phone || !website || !address || !country || !city || !tax_number) {
    return "Tüm zorunlu alanları doldurun.";
  }
  if (password.length < 6) {
    return "Şifre en az 6 karakter olmalıdır.";
  }
  if (body.role !== "demand_owner" && body.role !== "producer") {
    return "Geçersiz hesap türü.";
  }
  if (category_ids.length === 0) {
    return "En az bir kategori seçmelisiniz.";
  }
  if (!/^\d{10,11}$/.test(tax_number)) {
    return "TC / vergi kimlik numarası 10 veya 11 haneli olmalıdır.";
  }

  return null;
}

export function normalizeRegistrationPayload(body: Partial<RegistrationPayload>): RegistrationPayload {
  const company_name = body.company_name!.trim();
  const tax_number = body.tax_number!.replace(/\s/g, "");

  return {
    email: body.email!.trim(),
    password: body.password!,
    full_name: company_name,
    role: body.role!,
    company_name,
    phone: body.phone!.trim(),
    website: body.website!.trim(),
    address: body.address!.trim(),
    country: body.country!.trim(),
    city: body.city!.trim(),
    tax_number,
    national_id: tax_number,
    category_ids: (body.category_ids ?? []).filter(Boolean),
  };
}
