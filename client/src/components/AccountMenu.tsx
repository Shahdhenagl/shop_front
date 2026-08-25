/* Style: SAFETY ENG — قائمة الحساب ككتلة صغيرة واضحة بجانب أدوات الشراء، مع حالة دخول صريحة وإغلاق آمن خارجها. */
import { useEffect, useRef, useState } from "react";
import { ClipboardList, LogIn, LogOut, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { hasAuthToken, logout } from "@/lib/api";

export default function AccountMenu() {
  const [, navigate] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(() => hasAuthToken());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const syncAuthState = () => setIsSignedIn(hasAuthToken());
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
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
      toast.success("تم تسجيل الخروج من هذا الجهاز");
    } finally {
      localStorage.removeItem("safety-eng-token");
      setIsSignedIn(false);
      setIsOpen(false);
      setIsLoggingOut(false);
      window.dispatchEvent(new Event("safety-auth-updated"));
      navigate("/");
    }
  };

  return (
    <div className="account-menu-wrap" ref={menuRef}>
      <button
        type="button"
        className={`icon-link header-icon-link account-link account-menu-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={isSignedIn ? "فتح قائمة حسابي" : "فتح قائمة الحساب وتسجيل الدخول"}
      >
        <UserRound size={18} /> <span>{isSignedIn ? "حسابي" : "دخول"}</span>
      </button>
      {isOpen && (
        <div className="account-menu-popover" role="menu" aria-label="قائمة الحساب">
          <div className="account-menu-heading">
            <span className="account-menu-avatar"><UserRound size={16} /></span>
            <span><b>{isSignedIn ? "حساب SAFETY ENG" : "حساب العميل"}</b><small>{isSignedIn ? "إدارة مشترياتك وخدماتك" : "سجّلي الدخول للحفظ والمتابعة"}</small></span>
          </div>
          {isSignedIn ? (
            <>
              <button type="button" role="menuitem" onClick={() => { setIsOpen(false); navigate("/account"); }}><UserRound size={16} /> حسابي</button>
              <button type="button" role="menuitem" onClick={() => { setIsOpen(false); navigate("/orders"); }}><ClipboardList size={16} /> طلباتي</button>
              <button type="button" role="menuitem" className="account-menu-logout" onClick={handleLogout} disabled={isLoggingOut}><LogOut size={16} /> {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}</button>
            </>
          ) : (
            <button type="button" role="menuitem" className="account-menu-login" onClick={() => { setIsOpen(false); navigate("/auth"); }}><LogIn size={16} /> تسجيل الدخول</button>
          )}
        </div>
      )}
    </div>
  );
}
