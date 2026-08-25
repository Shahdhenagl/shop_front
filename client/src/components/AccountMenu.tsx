/* Style: SAFETY ENG — قائمة الحساب ككتلة صغيرة واضحة بجانب أدوات الشراء، مع هوية المستخدم وتأكيد آمن قبل الخروج. */
import { useEffect, useRef, useState } from "react";
import { ClipboardList, LogIn, LogOut, UserRound, X } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { hasAuthToken, logout, readStoredUser, type ApiUser } from "@/lib/api";

export default function AccountMenu() {
  const [, navigate] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(() => hasAuthToken());
  const [user, setUser] = useState<ApiUser | null>(() => readStoredUser());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const syncAuthState = () => { setIsSignedIn(hasAuthToken()); setUser(readStoredUser()); };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) { setIsOpen(false); setConfirmLogout(false); }
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { setIsOpen(false); setConfirmLogout(false); }
    };
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("safety-auth-updated", syncAuthState);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("safety-auth-updated", syncAuthState);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (hasAuthToken()) await logout();
      toast.success("تم تسجيل الخروج بنجاح");
    } catch {
      localStorage.removeItem("safety-eng-token");
      localStorage.removeItem("safety-eng-user");
      toast.success("تم تسجيل الخروج من هذا الجهاز");
    } finally {
      localStorage.removeItem("safety-eng-token");
      localStorage.removeItem("safety-eng-user");
      setIsSignedIn(false);
      setUser(null);
      setIsOpen(false);
      setConfirmLogout(false);
      setIsLoggingOut(false);
      window.dispatchEvent(new Event("safety-auth-updated"));
      navigate("/");
    }
  };

  const avatar = user?.avatar || user?.profile_photo_url || user?.image;
  const displayName = user?.name || (isSignedIn ? "حسابي" : "دخول");

  return (
    <div className="account-menu-wrap" ref={menuRef}>
      <button type="button" className={`icon-link header-icon-link account-link account-menu-trigger ${isOpen ? "is-open" : ""}`} onClick={() => setIsOpen((current) => !current)} aria-haspopup="menu" aria-expanded={isOpen} aria-label={isSignedIn ? `فتح قائمة ${displayName}` : "فتح قائمة الحساب وتسجيل الدخول"}>
        {avatar ? <img className="account-menu-trigger-avatar" src={avatar} alt="" /> : <UserRound size={18} />}
        <span>{displayName}</span>
      </button>
      {isOpen && (
        <div className="account-menu-popover" role="menu" aria-label="قائمة الحساب">
          <div className="account-menu-heading">
            <span className="account-menu-avatar">{avatar ? <img src={avatar} alt="" /> : <UserRound size={16} />}</span>
            <span><b>{isSignedIn ? displayName : "حساب العميل"}</b><small>{isSignedIn ? (user?.email || "إدارة مشترياتك وخدماتك") : "سجّلي الدخول للحفظ والمتابعة"}</small></span>
          </div>
          {isSignedIn ? (
            <>
              <button type="button" role="menuitem" onClick={() => { setIsOpen(false); navigate("/account"); }}><UserRound size={16} /> حسابي</button>
              <button type="button" role="menuitem" onClick={() => { setIsOpen(false); navigate("/orders"); }}><ClipboardList size={16} /> طلباتي</button>
              <button type="button" role="menuitem" className="account-menu-logout" onClick={() => setConfirmLogout(true)} disabled={isLoggingOut}><LogOut size={16} /> تسجيل الخروج</button>
            </>
          ) : (
            <button type="button" role="menuitem" className="account-menu-login" onClick={() => { setIsOpen(false); navigate("/auth"); }}><LogIn size={16} /> تسجيل الدخول</button>
          )}
        </div>
      )}
      {confirmLogout && (
        <div className="logout-confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmLogout(false); }}>
          <section className="logout-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
            <button type="button" className="logout-confirm-close" onClick={() => setConfirmLogout(false)} aria-label="إغلاق"><X size={17} /></button>
            <span className="logout-confirm-icon"><LogOut size={21} /></span>
            <h2 id="logout-confirm-title">تسجيل الخروج؟</h2>
            <p>هتحتاجي تسجّلي الدخول مرة تانية لمتابعة السلة والطلبات والمفضلة.</p>
            <div className="logout-confirm-actions">
              <button type="button" className="secondary-button" onClick={() => setConfirmLogout(false)} disabled={isLoggingOut}>إلغاء</button>
              <button type="button" className="primary-button logout-confirm-submit" onClick={handleLogout} disabled={isLoggingOut}>{isLoggingOut ? "جاري تسجيل الخروج..." : "تأكيد الخروج"}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
