// Style: SAFETY ENG — لوحة متابعة هادئة ومباشرة؛ الحالة أهم من الزخرفة، وكل بطاقة تمنح المستخدم خطوة واضحة.
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ClipboardList, Clock3, Home, LoaderCircle, MessageCircle, PackageCheck, Wrench } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import InnerHeader from "@/components/InnerHeader";
import SiteFooter from "@/components/SiteFooter";
import { formatPrice } from "@/lib/store";
import { getOrders, getServiceRequests, hasAuthToken } from "@/lib/api";

type Order = { id: number | string; status?: string; created_at?: string; total?: number | string; subtotal?: number | string; items?: Array<{ product_name?: string; quantity?: number; total?: number | string }> };
type ServiceRequest = { id: number | string; status?: string; service?: string; type?: string; created_at?: string; details?: string };

const statusLabels: Record<string, string> = { pending: "قيد المراجعة", processing: "جاري التجهيز", confirmed: "تم التأكيد", shipped: "في الطريق", completed: "مكتمل", cancelled: "ملغي", rejected: "مرفوض" };
function unwrapList(payload: any) { const data = payload?.data; if (Array.isArray(data)) return data; if (Array.isArray(data?.data)) return data.data; return []; }
function formatDate(value?: string) { if (!value) return "التاريخ غير متاح"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }); }
function statusLabel(status?: string) { return statusLabels[String(status || "pending").toLowerCase()] || status || "قيد المتابعة"; }

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceApiAvailable, setServiceApiAvailable] = useState(true);
  const authenticated = hasAuthToken();

  useEffect(() => {
    if (!authenticated) { setLoading(false); return; }
    let active = true;
    Promise.allSettled([getOrders(), getServiceRequests()]).then(([ordersResult, servicesResult]) => {
      if (!active) return;
      if (ordersResult.status === "fulfilled") setOrders(unwrapList(ordersResult.value));
      else toast.error("تعذر تحميل سجل الطلبات الآن");
      if (servicesResult.status === "fulfilled") setServices(unwrapList(servicesResult.value));
      else setServiceApiAvailable(false);
      setLoading(false);
    });
    return () => { active = false; };
  }, [authenticated]);

  if (!authenticated) return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><InnerHeader /><main className="container orders-page"><div className="orders-login-card"><ClipboardList size={38} /><span className="section-kicker">منطقة العميل</span><h1>سجّلي الدخول لمتابعة طلباتك.</h1><p>بعد تسجيل الدخول هتقدري تشوفي حالة الطلبات وسجل خدمات التركيب والصيانة المرتبط بحسابك.</p><Link href="/auth" className="primary-button">تسجيل الدخول <ArrowLeft size={16} /></Link></div></main><SiteFooter /></div>;
  if (loading) return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><InnerHeader /><main className="container orders-page"><div className="orders-loading"><LoaderCircle className="loading-spinner" size={26} /><p>جاري تحميل سجل طلباتك...</p></div></main><SiteFooter /></div>;

  return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><InnerHeader /><main className="container orders-page"><div className="orders-heading"><div><span className="section-kicker"><ClipboardList size={14} /> منطقة العميل</span><span className="paper-sticker">ملف العميل · ٠١</span><h1>طلباتي</h1><p>تابعي مشترياتك وخدمات SAFETY ENG من مكان واحد.</p></div><Link href="/shop" className="secondary-button">تصفحي المتجر <ArrowLeft size={16} /></Link></div><section className="orders-section"><div className="orders-section-title"><span><PackageCheck size={19} /> مشترياتي</span><b>{orders.length} طلب</b></div>{orders.length ? <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-top"><div><span className="order-id">طلب رقم #{order.id}</span><small><CalendarDays size={13} /> {formatDate(order.created_at)}</small></div><strong className={`order-status status-${String(order.status || "pending").toLowerCase()}`}><Clock3 size={14} /> {statusLabel(order.status)}</strong></div><div className="order-items">{(order.items || []).map((item, index) => <div key={`${order.id}-${index}`}><span>{item.product_name || "منتج SAFETY ENG"} × {item.quantity || 1}</span><b>{item.total != null ? formatPrice(Number(item.total)) : "—"}</b></div>)}</div><div className="order-total"><span>الإجمالي</span><strong>{formatPrice(Number(order.total ?? order.subtotal ?? 0))}</strong></div></article>)}</div> : <div className="orders-empty"><PackageCheck size={28} /><h3>لسه مفيش طلبات</h3><p>لما تأكدي أول طلب، هتلاقي حالته وتفاصيله هنا.</p><Link href="/shop" className="text-link">ابدئي التسوق <ArrowLeft size={15} /></Link></div>}</section><section className="orders-section services-history"><div className="orders-section-title"><span><Wrench size={19} /> خدمات التركيب والصيانة</span><b>{services.length} خدمة</b></div>{services.length ? <div className="services-history-list">{services.map((service) => <article className="service-history-card" key={service.id}><div className="service-history-icon"><Wrench size={19} /></div><div><b>{service.service || service.type || "طلب خدمة أو معاينة"}</b><small><CalendarDays size={13} /> {formatDate(service.created_at)}</small>{service.details && <p>{service.details}</p>}</div><strong className={`order-status status-${String(service.status || "pending").toLowerCase()}`}>{statusLabel(service.status)}</strong></article>)}</div> : <div className="orders-empty"><MessageCircle size={28} /><h3>{serviceApiAvailable ? "لسه مفيش خدمات مسجلة" : "سجل الخدمات يحتاج تفعيل API"}</h3><p>{serviceApiAvailable ? "طلبات المعاينة والتركيب والصيانة هتظهر هنا بعد إرسالها من حسابك." : "الواجهة جاهزة لعرض السجل، لكن Laravel لم يوفّر endpoint للخدمات في العقد الحالي."}</p><Link href="/contact" className="text-link">اطلبي خدمة <ArrowLeft size={15} /></Link></div>}</section><div className="orders-help"><Home size={18} /><span><b>محتاجة مساعدة في طلبك؟</b><small>فريقنا جاهز يرد عليك ويحدد الخطوة التالية.</small></span><Link href="/contact" className="secondary-button">تواصل معنا <ArrowLeft size={15} /></Link></div></main><SiteFooter /></div>;
}
