/* Style: SAFETY ENG — هيدر RTL موحّد؛ الشعار ثم التنقل ثم البحث ثم أيقونات التحكم، مع بوب‑أب واضح وتحكم كامل بلوحة المفاتيح. */
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ClipboardList, Heart, Home, LoaderCircle, MessageCircle, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice, readIds } from "@/lib/store";
import AccountMenu from "@/components/AccountMenu";

function HeaderSearch() {
  const [location, navigate] = useLocation();
  const { products, loading: productsLoading } = useProducts();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const nextQuery = new URLSearchParams(location.split("?")[1] || "").get("q") || "";
    setQuery(nextQuery);
  }, [location]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const openSearchShortcut = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget = Boolean(target && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable));
      if (event.key === "/" && !isTypingTarget && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        setIsFocused(true);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    document.addEventListener("keydown", openSearchShortcut);
    return () => document.removeEventListener("keydown", openSearchShortcut);
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsFocused(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFocused]);

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

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
      return;
    }
    if (!showPopup || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const product = suggestions[activeIndex];
      setIsFocused(false);
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="header-search-wrap" ref={wrapperRef}>
      <form className="inner-search" onSubmit={submitSearch} role="search">
        {productsLoading && normalizedQuery ? <LoaderCircle className="header-search-spinner loading-spinner" size={16} aria-label="جاري تحميل الاقتراحات" /> : <Search size={16} aria-hidden="true" />}
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="دوري على اللي محتاجاه..."
          aria-label="البحث في المتجر"
          aria-expanded={showPopup}
          aria-controls="header-search-popover"
          aria-activedescendant={activeIndex >= 0 ? `header-search-suggestion-${suggestions[activeIndex]?.id}` : undefined}
          autoComplete="off"
        />
        {query && (
          <button type="button" className="header-search-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="مسح البحث">
            <X size={13} />
          </button>
        )}
        <button type="submit" className="header-search-submit" aria-label="بحث">
          <ArrowLeft size={15} />
        </button>
      </form>
      {showPopup && (
        <div id="header-search-popover" className="header-search-popover" role="listbox" aria-label="اقتراحات البحث">
          {productsLoading ? (
            <div className="header-search-loading" role="status" aria-live="polite"><LoaderCircle className="loading-spinner" size={20} /><span><b>جاري تحميل الاقتراحات</b><small>لحظة ونجيب لك المنتجات المناسبة.</small></span></div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="header-search-popover-head">
                <span>نتائج سريعة</span>
                <small>{suggestions.length} اقتراحات · استخدمي ↑ ↓ ثم Enter</small>
              </div>
              {suggestions.map((product, index) => (
                <Link
                  key={product.id}
                  id={`header-search-suggestion-${product.id}`}
                  href={`/product/${product.id}`}
                  className={`header-search-suggestion ${activeIndex === index ? "is-active" : ""}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
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
    const syncHeaderState = () => {
      setFavoriteCount(readIds("fluxmart-favorites").length);
      setCartCount(readIds("fluxmart-cart").length);

    };
    window.addEventListener("storage", syncHeaderState);
    window.addEventListener("safety-cart-updated", syncHeaderState);
    window.addEventListener("safety-auth-updated", syncHeaderState);
    return () => {
      window.removeEventListener("storage", syncHeaderState);
      window.removeEventListener("safety-cart-updated", syncHeaderState);
      window.removeEventListener("safety-auth-updated", syncHeaderState);
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
          <AccountMenu />
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
