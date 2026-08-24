// SAFETY ENG auth — واجهة بسيطة لتسجيل الدخول والتسجيل قبل استخدام APIs المحمية.
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { login, register } from "@/lib/api";

export default function Auth() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>;
    try {
      if (mode === "login") { await login({ email: data.email, password: data.password }); toast.success("تم تسجيل الدخول"); navigate("/shop"); }
      else { await register(data); toast.success("تم إنشاء الحساب، سجّلي الدخول لإكمال الطلب"); setMode("login"); }
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر إكمال العملية"); }
    finally { setBusy(false); }
  };
  return <main dir="rtl" className="auth-page"><div className="auth-card"><Link href="/" className="back-link"><ArrowRight size={16} /> الرجوع للمتجر</Link><span className="section-kicker"><LockKeyhole size={14} /> SAFETY ENG account</span><h1>{mode === "login" ? "دخول أسرع." : "حسابك جاهز."}</h1><p>{mode === "login" ? "سجّلي الدخول لمتابعة المفضلة والسلة والطلبات." : "أنشئي حسابًا لإتمام طلباتك بسهولة."}</p><form onSubmit={submit}>{mode === "register" && <label><UserRound size={15} /> الاسم<input name="name" required placeholder="الاسم بالكامل" /></label>}<label><Mail size={15} /> البريد<input name="email" type="email" required placeholder="name@example.com" /></label>{mode === "register" && <label><Phone size={15} /> الهاتف<input name="phone" required placeholder="01xxxxxxxxx" /></label>}<label><LockKeyhole size={15} /> كلمة المرور<input name="password" type="password" required minLength={6} placeholder="••••••••" /></label>{mode === "register" && <label><LockKeyhole size={15} /> تأكيد كلمة المرور<input name="password_confirmation" type="password" required minLength={6} placeholder="••••••••" /></label>}<button className="primary-button" disabled={busy}>{busy ? "جاري التنفيذ..." : mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}</button></form><button className="auth-switch" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "لسه معندكيش حساب؟ إنشاء حساب" : "عندك حساب؟ تسجيل الدخول"}</button></div></main>;
}
