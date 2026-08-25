// Style: SAFETY ENG — هيدر داخلي عربي واضح؛ الرئيسية والمتجر وتواصل معنا دائمًا قريبون من المستخدم.
/* Style: SAFETY ENG — هيدر RTL واضح: الشعار ثم التنقل ثم البحث ثم أيقونات التحكم، مع صف بحث كامل على الموبايل. */
import { ClipboardList, Heart, Moon, ShoppingBag, Sun, Home, MessageCircle, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function InnerHeader() {
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const nextQuery = new URLSearchParams(location.split("?")[1] || "").get("q") || "";
    setQuery(nextQuery);
  }, [location]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  };

  return (
    <header className="inner-header">
      <div className="container inner-header-row">
        <Link href="/" className="brand-lockup" dir="ltr" aria-label="SAFETY ENG الرئيسية">
          <span className="logo-mark" aria-hidden="true"><span className="logo-graphic">S</span></span>
          <b>SAFETY<span> ENG</span></b>
        </Link>
        <nav className="inner-nav" aria-label="التنقل الرئيسي">
          <Link href="/" className="inner-nav-link"><Home size={15} /> الرئيسية</Link>
          <Link href="/shop" className="inner-nav-link">المتجر</Link>
          <Link href="/contact" className="inner-nav-link"><MessageCircle size={15} /> تواصل معنا</Link>
          <Link href="/orders" className="inner-nav-link"><ClipboardList size={15} /> طلباتي</Link>
        </nav>
        <form className="inner-search" onSubmit={submitSearch} role="search">
          <Search size={16} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="دوري على اللي محتاجاه..." aria-label="البحث في المتجر" />
          <button type="submit" aria-label="بحث"><ArrowLeft size={15} /></button>
        </form>
        <div className="inner-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="تبديل الوضع الليلي">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          <Link href="/favorites" className="icon-link"><Heart size={18} /> <span>المفضلة</span></Link>
          <Link href="/cart" className="icon-link"><ShoppingBag size={18} /> <span>العربة</span></Link>
        </div>
      </div>
    </header>
  );
}
