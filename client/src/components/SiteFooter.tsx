// Style: SAFETY ENG — فوتر تحريري خفيف يعتمد على إعدادات Laravel العامة مع fallback محافظ للبيانات غير المتاحة.
import { ArrowLeft, Clock3, Facebook, Instagram, MapPin, MessageCircle, PhoneCall, Twitter, Wrench } from "lucide-react";
import { Link } from "wouter";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const quickLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/orders", label: "طلباتي" },
  { href: "/contact", label: "تواصل معنا" },
];

const policyLinks = [
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "الشروط والأحكام" },
  { href: "/refund", label: "سياسة الاسترجاع" },
];

export default function SiteFooter() {
  const settings = useSiteSettings();
  const contact = settings.contact_info || {};
  const social = (settings.social_media || {}) as Record<string, unknown>;
  const phone = contact.phone || "";
  const whatsapp = contact.whatsapp || (phone ? phone.replace(/^0/, "20") : "");
  const socialLinks = [
    { label: "فيسبوك", href: social.facebook, icon: Facebook },
    { label: "إنستجرام", href: social.instagram, icon: Instagram },
    { label: "تويتر / X", href: social.twitter || social.x, icon: Twitter },
  ].filter((item): item is typeof item & { href: string } => typeof item.href === "string" && item.href.length > 0);

  return (
    <footer className="site-footer" dir="rtl">
      <div className="container site-footer-shell">
        <section className="footer-brand-block" aria-label="عن SAFETY ENG">
          <span className="footer-index">SAFETY / ENG · ٠١</span>
          <Link href="/" className="footer-logo" dir="ltr" aria-label="SAFETY ENG الرئيسية">
            <span className="logo-mark" aria-hidden="true"><span className="logo-graphic">S</span></span>
            <span>SAFETY<span> ENG</span></span>
          </Link>
          <p>{settings.about_us || "حلول أمن ومراقبة وتجهيزات مكتبية، من الاختيار الواضح إلى التشغيل والدعم."}</p>
          <Link href="/contact" className="footer-primary-cta">اطلب معاينة <ArrowLeft size={15} /></Link>
          {socialLinks.length > 0 && <div className="footer-socials" aria-label="حسابات التواصل الاجتماعي">{socialLinks.map(({ label, href, icon: Icon }) => <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} key={label}><Icon size={16} /></a>)}</div>}
        </section>

        <nav className="footer-nav-block" aria-label="روابط سريعة">
          <span className="footer-label">تنقل سريع</span>
          <div className="footer-link-list">{quickLinks.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}</div>
          <span className="footer-label footer-policy-label">معلومات قانونية</span>
          <div className="footer-policy-list">{policyLinks.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}</div>
        </nav>

        <section className="footer-contact-block" aria-label="التواصل مع SAFETY ENG">
          <span className="footer-label">فريق SAFETY ENG</span>
          <h2>محتاجة حل مناسب لمكانك؟</h2>
          <p>ابعتي تفاصيل المكان أو المنتج، وفريقنا يساعدك في الخطوة التالية.</p>
          {(phone || contact.address || contact.working_hours || contact.working_days) && <div className="footer-contact-details">
            {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}><PhoneCall size={14} /> {phone}</a>}
            {contact.address && <span><MapPin size={14} /> {contact.address}</span>}
            {(contact.working_days || contact.working_hours) && <span><Clock3 size={14} /> {[contact.working_days, contact.working_hours].filter(Boolean).join(" · ")}</span>}
          </div>}
          <div className="footer-contact-actions">
            {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={15} /> واتساب</a>}
            {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}><PhoneCall size={15} /> اتصال مباشر</a>}
          </div>
        </section>
      </div>
      <div className="container site-footer-bottom">
        <span>© ٢٠٢٦ SAFETY ENG</span>
        <span><Wrench size={13} /> معاينة · تركيب · دعم مستمر</span>
      </div>
    </footer>
  );
}
