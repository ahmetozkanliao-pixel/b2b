import path from "path";

/** Vercel/serverless'ta dosya sistemi kalıcı değil; bellek içi store kullanılır. */
export function isDemoMemoryStore() {
  return Boolean(process.env.VERCEL);
}

/** Yerel geliştirmede kalıcı demo verisi. */
export function getDemoDataDir() {
  return path.join(process.cwd(), "data");
}
