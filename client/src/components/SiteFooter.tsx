// Style: SAFETY ENG — فوتر تحريري خفيف بثلاث كتل واضحة: العلامة، التنقل، والتواصل؛ بدون قائمة طويلة أو ازدحام بصري.
import { ArrowLeft, ClipboardList, Home, MessageCircle, PhoneCall, ShoppingBag, Wrench } from "lucide-react";
import { Link } from "wouter";

const quickLinks = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/shop", label: "المتجر", icon: ShoppingBag },
  { href: "/orders", label: "طلباتي", icon: ClipboardList },
  { href: "/contact", label: "تواصل معنا", icon: MessageCircle },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" dir="rtl">
      <div className="container site-footer-shell">
        <section className="footer-brand-block" aria-label="عن SAFETY ENG">
          <span className="footer-index">SAFETY / ENG · ٠١</span>
          <Link href="/" className="footer-logo" dir="ltr" aria-label="SAFETY ENG الرئيسية">
            <span className="logo-mark" aria-hidden="true"><span className="logo-graphic">S</span></span>
            <span>SAFETY<span> ENG</span></span>
          </Link>
          <p>حلول أمن ومراقبة وتجهيزات مكتبية، من الاختيار الواضح إلى التشغيل والدعم.</p>
          <Link href="/contact" className="footer-primary-cta">اطلب معاينة <ArrowLeft size={15} /></Link>
        </section>

        <nav className="footer-nav-block" aria-label="روابط سريعة">
          <span className="footer-label">تنقل سريع</span>
          <div className="footer-link-list">
            {quickLinks.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={15} /> {label}</Link>)}
          </div>
        </nav>

        <section className="footer-contact-block" aria-label="التواصل مع SAFETY ENG">
          <span className="footer-label">فريق SAFETY ENG</span>
          <h2>محتاجة حل مناسب لمكانك؟</h2>
          <p>ابعتي تفاصيل المكان أو المنتج، وفريقنا يساعدك في الخطوة التالية.</p>
          <div className="footer-contact-actions">
            <a href="https://wa.me/201604400000" target="_blank" rel="noreferrer"><MessageCircle size={15} /> واتساب</a>
            <a href="tel:+201604400000"><PhoneCall size={15} /> اتصال مباشر</a>
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
