import { DEMO_USERS, type DemoUser } from "./config";
import {
  findRegisteredDemoUserByEmail,
  getDemoCompany,
  getRegisteredDemoUserById,
} from "./store";
import type { DemoRegisteredUser } from "./types";

export function registeredUserToDemoUser(user: DemoRegisteredUser, company: DemoUser["company"]): DemoUser {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    full_name: user.full_name,
    role: user.role,
    company,
  };
}

export function findDemoUser(email: string, password: string): DemoUser | null {
  const staticUser = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (staticUser) return staticUser;

  const registered = findRegisteredDemoUserByEmail(email);
  if (!registered || registered.password !== password) return null;
  if (!registered.email_verified) return null;

  const company = getDemoCompany(registered.company_id);
  if (!company) return null;

  return registeredUserToDemoUser(registered, company);
}

export function findUnverifiedRegisteredUser(email: string, password: string) {
  const registered = findRegisteredDemoUserByEmail(email);
  if (!registered || registered.password !== password) return null;
  if (registered.email_verified) return null;
  return registered;
}

export function getDemoUserById(id: string): DemoUser | undefined {
  const staticUser = DEMO_USERS.find((u) => u.id === id);
  if (staticUser) return staticUser;

  const registered = getRegisteredDemoUserById(id);
  if (!registered) return undefined;

  const company = getDemoCompany(registered.company_id);
  if (!company) return undefined;

  return registeredUserToDemoUser(registered, company);
}
