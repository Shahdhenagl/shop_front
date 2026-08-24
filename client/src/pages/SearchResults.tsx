// Style: SAFETY ENG — نتائج بحث مباشرة ومرتبة، مع فلاتر عملية تساعد العميل على قرار شراء واضح.
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpLeft, Check, Heart, Moon, Search, ShoppingBag, Sun, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { formatPrice, getProductBrand, getProductSalesScore, isBestSeller, isInStock, isInstallable, readIds, saveIds } from "@/lib/store";
import { useProducts } from "@/hooks/useProducts";
import { toggleFavoriteApi } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";

const categories = ["كل الحلول", "كاميرات مراقبة", "بصمة وحضور", "أنظمة أمن", "شاشات", "تحكم وأبواب", "لابات وكمبيوترات", "ماوس وكيبورد", "مستلزمات مكتبية", "الطابعات والكاشير", "كابلات وملحقات"];

export default function SearchResults() {
  const { theme, toggleTheme } = useTheme();
  const { products, loading, isRemote } = useProducts();
  const [location, navigate] = useLocation();
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [category, setCategory] = useState("كل الحلول");
  const [brand, setBrand] = useState("كل العلامات");
  const [stockFilter, setStockFilter] = useState("all");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(35000);
  const [sort, setSort] = useState(() => localStorage.getItem("safety-shop-sort") || "featured");
  const [installableOnly, setInstallableOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => readIds("fluxmart-favorites"));
  const allBrands = useMemo(() => ["كل العلامات", ...Array.from(new Set(products.map(getProductBrand))).sort()], [products]);
  const suggestions = useMemo(() => query.trim() ? products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5) : [], [products, query]);
  const popularProducts = useMemo(() => { const featured = products.filter((product) => product.badge.includes("الأكثر") || product.badge.includes("اختيار")); return (featured.length ? featured : products).slice(0, 4); }, [products]);

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, [location]);

  useEffect(() => {
    localStorage.setItem("safety-shop-sort", sort);
  }, [sort]);

  const visible = useMemo(() => [...products].filter((product) => {
    const matchesQuery = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (category === "كل الحلول" || product.category === category) && (brand === "كل العلامات" || getProductBrand(product) === brand) && (stockFilter === "all" || (stockFilter === "in" ? isInStock(product) : !isInStock(product))) && (!installableOnly || isInstallable(product)) && product.price >= min && product.price <= max;
  }).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "newest" ? b.id - a.id : sort === "best" ? getProductSalesScore(b) - getProductSalesScore(a) : a.id - b.id), [products, query, category, brand, stockFilter, min, max, sort, installableOnly]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  };

  const resetFilters = () => { setCategory("كل الحلول"); setBrand("كل العلامات"); setStockFilter("all"); setMin(0); setMax(35000); setSort("featured"); setInstallableOnly(false); };
  const toggleFavorite = async (id: number) => { const next = favoriteIds.includes(id) ? favoriteIds.filter((item) => item !== id) : [...favoriteIds, id]; setFavoriteIds(next); saveIds("fluxmart-favorites", next); if (localStorage.getItem("safety-eng-token")) { try { await toggleFavoriteApi(id); } catch { toast.error("تعذر مزامنة المفضلة، تم حفظها محليًا"); } } toast.success(next.includes(id) ? "اتضاف للمفضلة" : "اتشال من المفضلة"); };

  return (
    <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]">
      <header className="inner-header"><div className="container flex items-center justify-between"><Link href="/" className="brand-lockup" dir="ltr"><span className="logo-mark" aria-hidden="true"><span className="logo-graphic">S</span></span><b>SAFETY<span> ENG</span></b></Link><div className="inner-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label="تبديل الوضع الليلي">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button><Link href="/shop" className="icon-link">المتجر</Link><Link href="/favorites" className="icon-link"><Heart size={18} /> المفضلة</Link><Link href="/cart" className="icon-link"><ShoppingBag size={18} /> العربة</Link></div></div></header>
      <main className="container search-results-page">
        <Breadcrumbs items={[{ label: "نتائج البحث" }]} />
        <div className="search-results-heading"><div><span className="section-kicker"><Search size={14} /> بحث SAFETY ENG</span><h1>نتائج البحث<br /><em>بوضوح.</em></h1><p>{query ? `نتائج مطابقة لـ «${query}»` : "اكتبي اسم المنتج أو الفئة لعرض النتائج المناسبة."}</p></div><Link href="/shop" className="secondary-button">تصفحي كل المنتجات <ArrowLeft size={16} /></Link></div>
        <div className="results-search-wrap"><form className="results-search-box" onSubmit={submitSearch}><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحثي عن كاميرا، لابتوب أو طابعة" /><button className="primary-button" type="submit">بحث <ArrowLeft size={15} /></button></form>{suggestions.length > 0 && <div className="results-suggestions">{suggestions.map((item) => <Link key={item.id} href={`/product/${item.id}`} className="suggestion-item"><img src={item.image} alt="" /><span><b>{item.name}</b><small>{item.category} · {formatPrice(item.price)}</small></span><ArrowUpLeft size={15} /></Link>)}</div>}</div>
        <div className="results-toolbar"><label>الفئة<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>العلامة<select value={brand} onChange={(event) => setBrand(event.target.value)}>{allBrands.map((item) => <option key={item}>{item}</option>)}</select></label><label>المخزون<select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}><option value="all">كل الحالات</option><option value="in">متاح الآن</option><option value="out">غير متاح</option></select></label><label>من<input type="number" min="0" value={min} onChange={(event) => setMin(Number(event.target.value))} /></label><label>إلى<input type="number" min="0" value={max} onChange={(event) => setMax(Number(event.target.value))} /></label><label>ترتيب<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">الأكثر صلة</option><option value="low">السعر: الأقل أولًا</option><option value="high">السعر: الأعلى أولًا</option><option value="newest">الأحدث</option><option value="best">الأكثر مبيعًا</option></select></label><label className="installable-toggle"><input type="checkbox" checked={installableOnly} onChange={(event) => setInstallableOnly(event.target.checked)} /><Wrench size={14} /><span>متاح للتركيب</span></label><button type="button" className="clear-filters" onClick={resetFilters}>مسح الفلاتر</button></div>
        <div className="search-results-meta"><span>{loading ? "جاري تحديث النتائج..." : `${visible.length} نتائج مطابقة`}</span>{isRemote && !loading && <small>بيانات مباشرة</small>}</div>
        {visible.length ? <div className="search-results-grid">{visible.map((product) => <article className="product-card" key={product.id}><div className={`product-image ${product.tone}`}><span className="product-badge">{product.badge}</span>{isBestSeller(product) && <span className="best-seller-badge">الأكثر مبيعًا <span aria-hidden="true">★</span></span>}<button onClick={() => toggleFavorite(product.id)} className={`wish-button ${favoriteIds.includes(product.id) ? "is-favorite" : ""}`} aria-label="إضافة للمفضلة"><Heart size={18} fill={favoriteIds.includes(product.id) ? "currentColor" : "none"} /></button><Link href={`/product/${product.id}`} className="product-image-link"><img src={product.image} alt={product.name} /></Link></div><div className="product-info"><span>{product.category}</span><small className={`stock-state ${isInStock(product) ? "in-stock" : "out-stock"}`}>{isInStock(product) ? "متاح في المخزون" : "غير متاح حاليًا"}</small><Link href={`/product/${product.id}`}><h3>{product.name}</h3></Link><div className="price-row"><strong>{formatPrice(product.price)}</strong><del>{product.oldPrice.toLocaleString("ar-EG")}</del><Link href={`/product/${product.id}`} className="add-button" aria-label={`عرض ${product.name}`}>+</Link></div></div></article>)}</div> : <div className="search-empty"><Search size={28} /><h2>مفيش نتائج بالبحث ده</h2><p>جربي كلمة مختلفة أو وسّعي نطاق السعر والفئة.</p><Link href="/shop" className="primary-button">عرض كل المنتجات <ArrowLeft size={16} /></Link>{popularProducts.length > 0 && <div className="empty-suggestions"><div className="empty-suggestions-heading"><b>ممكن يعجبك</b><span>اختيارات عليها طلب</span></div><div className="empty-suggestions-grid">{popularProducts.map((product) => <Link href={`/product/${product.id}`} className="empty-suggestion-card" key={product.id}><img src={product.image} alt={product.name} /><span><b>{product.name}</b><small>{formatPrice(product.price)}</small></span><ArrowLeft size={14} /></Link>)}</div></div>}</div>}
      </main>
    </div>
  );
}
