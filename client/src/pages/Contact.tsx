// Style: SAFETY ENG — صفحة تواصل دافئة وعملية، تجعل طلب المعاينة خطوة مباشرة وواضحة.
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, LocateFixed, MapPin, MessageCircle, Moon, Sun, Upload, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Contact() {
  const { theme, toggleTheme } = useTheme();
  const [serviceFiles, setServiceFiles] = useState<File[]>([]);
  const [serviceLocation, setServiceLocation] = useState("");

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setServiceLocation(`https://maps.google.com/?q=${coords.latitude},${coords.longitude}`);
        toast.success("تم تحديد موقعك بنجاح");
      },
      () => toast.error("لم نتمكن من تحديد موقعك، اكتبي العنوان يدويًا"),
    );
  };

  const submitService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `مرحبًا SAFETY ENG، أريد التواصل وطلب خدمة.\nالاسم: ${data.get("name")}\nالهاتف: ${data.get("phone")}\nالخدمة: ${data.get("service")}\nتفاصيل المكان: ${data.get("details") || "غير مذكورة"}\nالموقع: ${serviceLocation || "سيتم إرساله لاحقًا"}\nالصور المختارة: ${serviceFiles.length ? serviceFiles.map((file) => file.name).join("، ") : "لم يتم إرفاق صور"}`;
    window.open(`https://wa.me/201604400000?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    toast.success("تم تجهيز رسالة واتساب ببيانات طلبك");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]">
      <header className="inner-header">
        <div className="container flex items-center justify-between">
          <Link href="/" className="brand-lockup" dir="ltr"><span className="logo-mark" aria-hidden="true"><span className="logo-graphic">S</span></span><b>SAFETY<span> ENG</span></b></Link>
          <div className="inner-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="تبديل الوضع الليلي">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
            <Link href="/shop" className="icon-link">المتجر</Link>
            <Link href="/cart" className="icon-link">العربة</Link>
          </div>
        </div>
      </header>
      <main className="container contact-page">
        <Breadcrumbs items={[{ label: "تواصل معنا" }]} />
        <section className="contact-hero">
          <div>
            <span className="section-kicker"><MessageCircle size={14} /> تواصل معنا</span>
            <h1>خلّي خطوتك<br /><em>أسهل وأوضح.</em></h1>
            <p>اطلبي معاينة أو تركيب أو صيانة، وسيقوم فريق SAFETY ENG بالتواصل معك لتحديد الحل والموعد المناسب.</p>
            <div className="contact-points"><span><Check size={16} /> رد سريع عبر واتساب</span><span><Check size={16} /> معاينة حسب احتياج المكان</span><span><Check size={16} /> تركيب وبرمجة ودعم بعد التسليم</span></div>
          </div>
          <div className="contact-callout"><Wrench size={28} /><b>جاهزة نبدأ؟</b><span>اكتبي تفاصيل المكان، والباقي على فريق SAFETY ENG.</span></div>
        </section>
        <section className="contact-form-layout">
          <div className="contact-form-intro"><span className="section-kicker">طلب خدمة أو معاينة</span><h2>قولي لنا<br /><em>محتاجِة إيه.</em></h2><p>كلما كانت التفاصيل أوضح، قدرنا نرشح لك تجهيزًا أدق من أول تواصل.</p></div>
          <form className="service-request-form contact-form" onSubmit={submitService}>
            <h3>بيانات التواصل</h3>
            <label>الاسم<input name="name" required placeholder="اسمك بالكامل" /></label>
            <label>رقم الموبايل<input name="phone" required pattern="[0-9٠-٩ +()-]{8,}" placeholder="01xxxxxxxxx" /></label>
            <label>نوع الخدمة<select name="service" defaultValue="" required><option value="" disabled>اختاري الخدمة</option><option>تركيب كاميرات مراقبة</option><option>إعداد نظام بصمة وحضور</option><option>صيانة أو توسعة نظام حالي</option><option>تركيب شاشة غرفة مراقبة</option><option>معاينة وتجهيز مكتب أو كاشير</option></select></label>
            <label>تفاصيل المكان<textarea name="details" rows={4} placeholder="المدينة، نوع المكان، وعدد النقاط التقريبي"></textarea></label>
            <label>صور المكان<input type="file" name="photos" accept="image/*" multiple onChange={(event) => setServiceFiles(Array.from(event.target.files || []))} /></label>
            {serviceFiles.length > 0 && <div className="file-chips">{serviceFiles.map((file) => <span key={file.name}><Upload size={12} /> {file.name}</span>)}</div>}
            <div className="location-actions"><button type="button" className="location-button" onClick={captureLocation}><LocateFixed size={15} /> تحديد موقعي تلقائيًا</button><label className="location-input"><MapPin size={15} /><input value={serviceLocation} onChange={(event) => setServiceLocation(event.target.value)} placeholder="أو الصق رابط Google Maps" /></label></div>
            <small className="form-help">بعد الإرسال ستفتح رسالة واتساب جاهزة بالبيانات وأسماء الصور المختارة لإرفاقها في المحادثة.</small>
            <button className="primary-button" type="submit">إرسال الطلب عبر واتساب <MessageCircle size={16} /></button>
          </form>
        </section>
        <Link href="/shop" className="secondary-button contact-shop-link">تصفحي المنتجات <ArrowLeft size={16} /></Link>
      </main>
    </div>
  );
}
