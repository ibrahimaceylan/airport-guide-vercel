import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale ?? "en";
  try {
    const messages = (await import(`../locales/${currentLocale}.json`)).default;
    return { locale: currentLocale, messages };
  } catch {
    const fallback = (await import(`../src/locales/en.json`)).default;
    return { locale: "en", messages: fallback };
  }
});
