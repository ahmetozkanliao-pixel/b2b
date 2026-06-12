import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE, type DemoUser } from "./config";
import { findDemoUser, getDemoUserById } from "./user-lookup";

export interface DemoSession {
  userId: string;
  email: string;
  full_name: string;
  role: DemoUser["role"];
  companyId: string;
}

export { findDemoUser, getDemoUserById };

export function createDemoSession(user: DemoUser): DemoSession {
  return {
    userId: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    companyId: user.company.id,
  };
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as DemoSession;
    if (!getDemoUserById(session.userId)) return null;
    return session;
  } catch {
    return null;
  }
}
