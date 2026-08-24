// Style: SAFETY ENG — تذييل هادئ ومباشر يحافظ على مسارات التنقل الأساسية في كل الصفحات.
import { ArrowLeft, ClipboardList, Home, MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-main">
        <Link href="/" className="footer-logo" dir="ltr" aria-label="SAFETY ENG الرئيسية">
          <span className="logo-mark" aria-hidden="true"><span className="logo-graphic">S</span></span>
          <span>SAFETY<span> ENG</span></span>
        </Link>
        <p>حلول مراقبة وتجهيزات عملية، من أول اختيار لحد الدعم بعد التركيب.</p>
        <nav className="site-footer-links" aria-label="روابط سريعة">
          <Link href="/"><Home size={15} /> الرئيسية</Link>
          <Link href="/shop"><ShoppingBag size={15} /> المتجر</Link>
          <Link href="/contact"><MessageCircle size={15} /> تواصل معنا</Link>
          <Link href="/orders"><ClipboardList size={15} /> طلباتي</Link>
        </nav>
        <Link href="/contact" className="footer-cta">اطلب معاينة <ArrowLeft size={15} /></Link>
      </div>
      <div className="container site-footer-bottom">
        <span>© ٢٠٢٦ SAFETY ENG. أمانك أولاً.</span>
        <span>معاينة · تركيب · دعم مستمر</span>
      </div>
    </footer>
  );
}
