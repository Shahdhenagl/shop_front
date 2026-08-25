/* Style: SAFETY ENG — صفحة الحساب سطح ورقي هادئ يعرض بيانات Laravel فقط، مع مسارات واضحة للطلبات والمفضلة والسلة. */
import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Heart, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "wouter";
import { getCurrentUser, hasAuthToken, type ApiUser } from "@/lib/api";
import InnerHeader from "@/components/InnerHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Account() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!hasAuthToken()) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then((response) => {
        const payload = response.data as any;
        const raw = payload?.data ?? payload?.user ?? payload;
        if (raw?.id) setUser(raw as ApiUser);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]">
      <InnerHeader />
      <main className="container account-page">
        <span className="section-kicker"><UserRound size={14} /> منطقة العميل</span>
        <span className="paper-sticker">ACCOUNT · ٠١</span>
        <div className="account-heading">
          <div>
            <h1>حسابي</h1>
            <p>بياناتك الأساسية ومساراتك المهمة في SAFETY ENG.</p>
          </div>
          <ShieldCheck size={38} />
        </div>
        {!hasAuthToken() ? (
          <section className="account-card account-empty">
            <UserRound size={28} />
            <h2>سجّلي الدخول لحسابك</h2>
            <p>بعد تسجيل الدخول هتقدري تراجعي بياناتك وطلباتك بسهولة.</p>
            <Link href="/auth" className="primary-button">تسجيل الدخول <ArrowLeft size={16} /></Link>
          </section>
        ) : loading ? (
          <section className="account-card account-loading"><span className="loading-spinner"><ShieldCheck size={24} /></span><p>جاري تحميل بيانات حسابك...</p></section>
        ) : error || !user ? (
          <section className="account-card account-empty">
            <ShieldCheck size={28} />
            <h2>تعذر تحميل بيانات الحساب</h2>
            <p>تأكدي من اتصال الحساب ثم حاولي مرة أخرى.</p>
            <Link href="/auth" className="secondary-button">إعادة تسجيل الدخول <ArrowLeft size={16} /></Link>
          </section>
        ) : (
          <section className="account-card account-profile">
            <div className="account-avatar"><UserRound size={26} /></div>
            <div className="account-profile-main">
              <span className="account-label">الاسم</span>
              <h2>{user.name}</h2>
              <div className="account-details">
                <span><Mail size={15} /> {user.email}</span>
                {user.phone && <span><Phone size={15} /> {user.phone}</span>}
              </div>
            </div>
            <div className="account-shortcuts">
              <Link href="/orders"><ClipboardList size={17} /> طلباتي <ArrowLeft size={14} /></Link>
              <Link href="/favorites"><Heart size={17} /> المفضلة <ArrowLeft size={14} /></Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
