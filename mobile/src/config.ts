import Constants from "expo-constants";

export const WEB_BASE_URL =
  (Constants.expoConfig?.extra?.webBaseUrl as string | undefined) ??
  "https://b2b212.vercel.app";

export const ONBOARDING_STORAGE_KEY = "b2b_onboarding_complete";
