/* Style: SAFETY ENG — صفحة الحساب سطح ورقي هادئ يعرض بيانات Laravel فقط، مع ملخص الطلبات وتعديل مباشر آمن. */
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, ClipboardList, Heart, Mail, Pencil, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getCurrentUser, getOrders, hasAuthToken, updateCurrentUser, type ApiUser } from "@/lib/api";
import InnerHeader from "@/components/InnerHeader";
import SiteFooter from "@/components/SiteFooter";

type AccountOrder = { id: number | string; status?: string; total?: number; created_at?: string; createdAt?: string; items?: unknown[] };
const statusLabels: Record<string, string> = { pending: "قيد المراجعة", processing: "جاري التجهيز", shipped: "تم الشحن", delivered: "تم التسليم", completed: "مكتمل", cancelled: "ملغي" };

function extractUser(payload: any) { return (payload?.data ?? payload?.user ?? payload) as ApiUser; }
function extractOrders(payload: any): AccountOrder[] { const value = payload?.data ?? payload?.orders ?? payload; const list = Array.isArray(value) ? value : value?.data; return Array.isArray(list) ? list as AccountOrder[] : []; }
function formatOrderDate(value?: string) { if (!value) return "تاريخ غير متاح"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "تاريخ غير متاح" : date.toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" }); }

export default function Account() {
  const signedIn = hasAuthToken();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!signedIn) { setLoading(false); setOrdersLoading(false); return; }
    getCurrentUser()
      .then((response) => { const nextUser = extractUser(response.data); if (nextUser?.id) { setUser(nextUser); setForm({ name: nextUser.name || "", email: nextUser.email || "", phone: nextUser.phone || "" }); } else setError(true); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    getOrders()
      .then((response) => setOrders(extractOrders(response.data).slice(0, 3)))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [signedIn]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { toast.error("اكتبي الاسم والبريد الإلكتروني أولًا"); return; }
    setSaving(true);
    try {
      const response = await updateCurrentUser({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined });
      const nextUser = extractUser(response.data);
      if (nextUser?.id) { setUser(nextUser); setForm({ name: nextUser.name || "", email: nextUser.email || "", phone: nextUser.phone || "" }); }
      setEditing(false);
      toast.success("تم تحديث بيانات حسابك");
    } catch (requestError) { toast.error(requestError instanceof Error ? requestError.message : "تعذر تحديث البيانات"); }
    finally { setSaving(false); }
  };

  const avatar = user?.avatar || user?.profile_photo_url || user?.image;

  return (
    <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]">
      <InnerHeader />
      <main className="container account-page">
        <span className="section-kicker"><UserRound size={14} /> منطقة العميل</span>
        <span className="paper-sticker">ACCOUNT · ٠١</span>
        <div className="account-heading"><div><h1>حسابي</h1><p>بياناتك الأساسية، وأحدث طلباتك، ومساراتك المهمة في SAFETY ENG.</p></div><ShieldCheck size={38} /></div>
        {!signedIn ? (
          <section className="account-card account-empty"><UserRound size={28} /><h2>سجّلي الدخول لحسابك</h2><p>بعد تسجيل الدخول هتقدري تراجعي بياناتك وطلباتك بسهولة.</p><Link href="/auth" className="primary-button">تسجيل الدخول <ArrowLeft size={16} /></Link></section>
        ) : loading ? (
          <section className="account-card account-loading"><span className="loading-spinner"><ShieldCheck size={24} /></span><p>جاري تحميل بيانات حسابك...</p></section>
        ) : error || !user ? (
          <section className="account-card account-empty"><ShieldCheck size={28} /><h2>تعذر تحميل بيانات الحساب</h2><p>تأكدي من اتصال الحساب ثم حاولي مرة أخرى.</p><Link href="/auth" className="secondary-button">إعادة تسجيل الدخول <ArrowLeft size={16} /></Link></section>
        ) : (
          <>
            <section className="account-card account-profile">
              <div className="account-avatar account-avatar-large">{avatar ? <img src={avatar} alt={`صورة ${user.name}`} /> : <UserRound size={27} />}</div>
              <div className="account-profile-main"><span className="account-label">حساب العميل</span><h2>{user.name}</h2><div className="account-details"><span><Mail size={15} /> {user.email}</span>{user.phone && <span><Phone size={15} /> {user.phone}</span>}</div></div>
              <button type="button" className="secondary-button account-edit-trigger" onClick={() => setEditing((current) => !current)}><Pencil size={15} /> {editing ? "إلغاء التعديل" : "تعديل بياناتي"}</button>
            </section>
            {editing && <form className="account-card account-edit-form" onSubmit={saveProfile}><div className="account-edit-heading"><div><span className="account-label">تحديث مباشر</span><h2>بياناتك في مكانها.</h2></div><Check size={22} /></div><label>الاسم الكامل<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label><label>البريد الإلكتروني<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label><label>رقم الهاتف<input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="01xxxxxxxxx" /></label><button type="submit" className="primary-button" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ التعديلات"} <Check size={16} /></button></form>}
            <section className="account-orders-section"><div className="account-section-heading"><div><span className="section-kicker"><ClipboardList size={14} /> آخر حركة</span><h2>أحدث طلباتك</h2></div><Link href="/orders" className="text-link">كل الطلبات <ArrowLeft size={15} /></Link></div>{ordersLoading ? <div className="account-orders-loading"><span className="loading-spinner"><ClipboardList size={20} /></span> جاري تحميل الطلبات...</div> : orders.length === 0 ? <div className="account-card account-orders-empty"><ClipboardList size={24} /><p>لسه مفيش طلبات مسجلة على حسابك.</p><Link href="/shop" className="secondary-button">تصفحي المتجر <ArrowLeft size={15} /></Link></div> : <div className="account-orders-list">{orders.map((order) => <Link href="/orders" className="account-order-row" key={order.id}><span className="account-order-icon"><ClipboardList size={18} /></span><span className="account-order-main"><b>طلب #{order.id}</b><small>{formatOrderDate(order.created_at || order.createdAt)} · {order.items?.length || 0} منتجات</small></span><span className={`order-status order-status-${order.status || "pending"}`}>{statusLabels[order.status || "pending"] || order.status || "قيد المتابعة"}</span><ArrowLeft size={15} /></Link>)}</div>}</section>
            <div className="account-shortcuts"><Link href="/orders"><ClipboardList size={17} /> طلباتي <ArrowLeft size={14} /></Link><Link href="/favorites"><Heart size={17} /> المفضلة <ArrowLeft size={14} /></Link></div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
