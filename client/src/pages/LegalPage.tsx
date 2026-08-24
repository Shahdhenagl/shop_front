// Style: SAFETY ENG — صفحات قانونية هادئة كأوراق كتالوج، تقرأ النص من إعدادات Laravel دون HTML غير موثوق.
import { FileText } from "lucide-react";
import InnerHeader from "@/components/InnerHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type LegalKind = "privacy_policy" | "terms_conditions" | "refund_policy";
const titles: Record<LegalKind, string> = { privacy_policy: "سياسة الخصوصية", terms_conditions: "الشروط والأحكام", refund_policy: "سياسة الاسترجاع" };

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const settings = useSiteSettings();
  const value = settings[kind];
  const paragraphs = typeof value === "string" && value.trim() ? value.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean) : ["سيتم نشر هذه السياسة من لوحة التحكم بعد اعتماد المحتوى الرسمي."];
  return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><InnerHeader /><main className="container legal-page"><span className="section-kicker"><FileText size={14} /> معلومات SAFETY ENG</span><span className="paper-sticker">وثيقة · SAFETY ENG</span><h1>{titles[kind]}</h1><div className="legal-paper">{paragraphs.map((paragraph, index) => <p key={`${kind}-${index}`}>{paragraph}</p>)}</div></main><SiteFooter /></div>;
}
