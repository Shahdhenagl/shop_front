// Style: SAFETY ENG — صفحة تواصل دافئة وعملية، تجعل طلب المعاينة خطوة مباشرة وواضحة.
import SiteFooter from "@/components/SiteFooter";
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, LocateFixed, LoaderCircle, MapPin, MessageCircle, Upload, Wrench } from "lucide-react";
import { toast } from "sonner";
import { createServiceRequest } from "@/lib/api";
import { isValidEgyptianPhone, phoneValidationMessage } from "@/lib/validation";
import Breadcrumbs from "@/components/Breadcrumbs";
import InnerHeader from "@/components/InnerHeader";

export default function Contact() {
  const [serviceFiles, setServiceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serviceLocation, setServiceLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

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

  const phoneError = phoneTouched && phone.length > 0 && !isValidEgyptianPhone(phone) ? phoneValidationMessage : "";
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => { setPhone(event.target.value); setPhoneTouched(true); };

  const submitService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEgyptianPhone(phone)) {
      setPhoneTouched(true);
      toast.error(phoneValidationMessage);
      return;
    }
    const data = new FormData(event.currentTarget);
    data.append("location", serviceLocation);
    setIsSubmitting(true);
    try {
      await createServiceRequest(data);
      toast.success("تم حفظ طلبك بنجاح، وسيتواصل معك فريق SAFETY ENG قريبًا");
      setIsSubmitted(true);
      event.currentTarget.reset();
      setServiceFiles([]);
      setServiceLocation("");
      setPhone("");
      setPhoneTouched(false);
    } catch {
      const message = `مرحبًا SAFETY ENG، أريد التواصل وطلب خدمة.\nالاسم: ${data.get("name")}\nالهاتف: ${data.get("phone")}\nالخدمة: ${data.get("service")}\nتفاصيل المكان: ${data.get("details") || "غير مذكورة"}\nالموقع: ${serviceLocation || "سيتم إرساله لاحقًا"}\nالصور المختارة: ${serviceFiles.length ? serviceFiles.map((file) => file.name).join("، ") : "لم يتم إرفاق صور"}`;
      window.open(`https://wa.me/201604400000?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      toast.error("تعذر حفظ الطلب عبر النظام، جهزنا لك رسالة واتساب كبديل");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]">
      <InnerHeader />
      <main className="container contact-page">
        <Breadcrumbs items={[{ label: "تواصل معنا" }]} />
        <span className="catalog-stamp">SERVICE · 03</span>
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
            <label>رقم الموبايل<input name="phone" required value={phone} onChange={handlePhoneChange} onBlur={() => setPhoneTouched(true)} inputMode="tel" pattern="[0-9٠-٩ +()-]{8,}" placeholder="01xxxxxxxxx" aria-invalid={Boolean(phoneError)} />{phoneError && <small className="field-error" role="alert">{phoneError}</small>}</label>
            <label>نوع الخدمة<select name="service" defaultValue="" required><option value="" disabled>اختاري الخدمة</option><option>تركيب كاميرات مراقبة</option><option>إعداد نظام بصمة وحضور</option><option>صيانة أو توسعة نظام حالي</option><option>تركيب شاشة غرفة مراقبة</option><option>معاينة وتجهيز مكتب أو كاشير</option></select></label>
            <label>تفاصيل المكان<textarea name="details" rows={4} placeholder="المدينة، نوع المكان، وعدد النقاط التقريبي"></textarea></label>
            <label>صور المكان<input type="file" name="photos" accept="image/*" multiple onChange={(event) => setServiceFiles(Array.from(event.target.files || []))} /></label>
            {serviceFiles.length > 0 && <div className="file-chips">{serviceFiles.map((file) => <span key={file.name}><Upload size={12} /> {file.name}</span>)}</div>}
            <div className="location-actions"><button type="button" className="location-button" onClick={captureLocation}><LocateFixed size={15} /> تحديد موقعي تلقائيًا</button><label className="location-input"><MapPin size={15} /><input value={serviceLocation} onChange={(event) => setServiceLocation(event.target.value)} placeholder="أو الصق رابط Google Maps" /></label></div>
            <small className="form-help">سيتم حفظ الطلب في النظام أولًا، وإذا تعذر الاتصال سنجهز رسالة واتساب بالبيانات كخطة احتياطية.</small>
            <button className="primary-button" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? <><LoaderCircle className="loading-spinner" size={16} /> جاري إرسال الطلب...</> : <>إرسال الطلب <MessageCircle size={16} /></>}</button>{isSubmitted && <div className="service-success-message" role="status" aria-live="polite"><Check size={20} /><span><b>تم استلام طلبك بنجاح</b><small>سيتواصل معك فريق SAFETY ENG قريبًا لتأكيد التفاصيل والموعد.</small></span></div>}
          </form>
        </section>
        <Link href="/shop" className="secondary-button contact-shop-link">تصفحي المنتجات <ArrowLeft size={16} /></Link>
      </main>
      <SiteFooter />
    </div>
  );
}
