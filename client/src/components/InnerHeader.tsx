/* Style: SAFETY ENG — هيدر RTL موحّد؛ الشعار ثم التنقل ثم البحث ثم أيقونات التحكم، مع بوب‑أب واضح لا يتداخل مع الروابط. */
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Heart, Home, MessageCircle, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice, readIds } from "@/lib/store";

function HeaderSearch() {
  const [location, navigate] = useLocation();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const nextQuery = new URLSearchParams(location.split("?")[1] || "").get("q") || "";
    setQuery(nextQuery);
  }, [location]);

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = normalizedQuery
    ? products
        .filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery))
        .slice(0, 5)
    : [];
  const showPopup = isFocused && normalizedQuery.length > 0;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFocused(false);
    navigate(normalizedQuery ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  };

  return (
    <div className="header-search-wrap">
      <form className="inner-search" onSubmit={submitSearch} role="search">
        <Search size={16} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="دوري على اللي محتاجاه..."
          aria-label="البحث في المتجر"
          aria-expanded={showPopup}
          aria-controls="header-search-popover"
        />
        {query && (
          <button type="button" className="header-search-clear" onClick={() => setQuery("")} aria-label="مسح البحث">
            <X size={13} />
          </button>
        )}
        <button type="submit" className="header-search-submit" aria-label="بحث">
          <ArrowLeft size={15} />
        </button>
      </form>
      {showPopup && (
        <div id="header-search-popover" className="header-search-popover" role="listbox" aria-label="اقتراحات البحث">
          {suggestions.length > 0 ? (
            <>
              <div className="header-search-popover-head">
                <span>نتائج سريعة</span>
                <small>{suggestions.length} اقتراحات</small>
              </div>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="header-search-suggestion"
                  role="option"
                  onMouseDown={() => setIsFocused(false)}
                >
                  <img src={product.image} alt="" />
                  <span>
                    <b>{product.name}</b>
                    <small>{product.category} · {formatPrice(product.price)}</small>
                  </span>
                  <ArrowLeft size={14} aria-hidden="true" />
                </Link>
              ))}
              <button type="button" className="header-search-all" onMouseDown={(event) => event.preventDefault()} onClick={() => { setIsFocused(false); navigate(`/search?q=${encodeURIComponent(query.trim())}`); }}>
                عرض كل النتائج <ArrowLeft size={14} />
              </button>
            </>
          ) : (
            <div className="header-search-empty" role="status">
              <Search size={18} />
              <span><b>مفيش نتائج مطابقة</b><small>جربي اسم منتج أو فئة مختلفة.</small></span>
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setIsFocused(false); navigate("/search"); }}>عرض الكتالوج</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InnerHeader() {
  const { theme, toggleTheme } = useTheme();
  const [favoriteCount, setFavoriteCount] = useState(() => readIds("fluxmart-favorites").length);
  const [cartCount, setCartCount] = useState(() => readIds("fluxmart-cart").length);

  useEffect(() => {
    const syncCounts = () => {
      setFavoriteCount(readIds("fluxmart-favorites").length);
      setCartCount(readIds("fluxmart-cart").length);
    };
    window.addEventListener("storage", syncCounts);
    window.addEventListener("safety-cart-updated", syncCounts);
    return () => {
      window.removeEventListener("storage", syncCounts);
      window.removeEventListener("safety-cart-updated", syncCounts);
    };
  }, []);

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
        <HeaderSearch />
        <div className="inner-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="تبديل الوضع الليلي">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          <Link href="/favorites" className="icon-link header-icon-link" aria-label={`المفضلة، ${favoriteCount} منتجات`}>
            <Heart size={18} /> <span>المفضلة</span><b className="header-badge">{favoriteCount}</b>
          </Link>
          <Link href="/cart" className="icon-link header-icon-link" aria-label={`العربة، ${cartCount} منتجات`}>
            <ShoppingBag size={18} /> <span>العربة</span><b className="header-badge cart-badge">{cartCount}</b>
          </Link>
        </div>
      </div>
    </header>
  );
}
