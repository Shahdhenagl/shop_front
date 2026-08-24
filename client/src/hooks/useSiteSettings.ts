// Style: SAFETY ENG — إعدادات الفوتر تأتي من Laravel مع fallback محافظ يحافظ على واجهة المتجر عند تعذر الشبكة.
import { useEffect, useState } from "react";
import { getPublicSettings, type SiteSettings } from "@/lib/api";

const fallbackSettings: SiteSettings = {
  contact_info: { phone: "01055885868", whatsapp: "201055885868" },
  social_media: {},
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);

  useEffect(() => {
    const controller = new AbortController();
    getPublicSettings(controller.signal)
      .then((remote) => setSettings({ ...fallbackSettings, ...remote, contact_info: { ...fallbackSettings.contact_info, ...remote.contact_info } }))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return settings;
}
