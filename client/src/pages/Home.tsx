// Style: اتجاه «ورق وبيكسل» — تخطيط تحريري غير متماثل، صور منتجات واضحة، ومساحات عاجية دافئة.
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpLeft,
  Camera,
  Check,
  ChevronDown,
  HardDrive,
  Headphones,
  Laptop,
  Menu,
  Monitor,
  PackageCheck,
  PenLine,
  Search,
  ShoppingBag,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";

const products = [
  { id: 1, name: "كاميرا Sony ZV-E10", category: "كاميرات", price: 28999, oldPrice: 31999, badge: "الأكثر طلباً", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85", tone: "coral" },
  { id: 2, name: "شاشة LG UltraWide 34 بوصة", category: "شاشات", price: 18499, oldPrice: 20999, badge: "خصم 12%", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85", tone: "teal" },
  { id: 3, name: "هارد SSD محمول 1TB", category: "هاردات", price: 4299, oldPrice: 4999, badge: "جديد", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85", tone: "lime" },
  { id: 4, name: "طقم تنظيم مكتب أنيق", category: "أدوات مكتبية", price: 899, oldPrice: 1199, badge: "اختيارنا", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=85", tone: "peach" },
  { id: 5, name: "كيبورد ميكانيكي أبيض", category: "أدوات مكتبية", price: 2199, oldPrice: 2599, badge: "محدود", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85", tone: "blue" },
  { id: 6, name: "كاميرا فورية Instax Mini", category: "كاميرات", price: 4999, oldPrice: 5599, badge: "هدية لطيفة", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85", tone: "yellow" },
];

const categories = [
  { label: "كل المنتجات", icon: Sparkles },
  { label: "كاميرات", icon: Camera },
  { label: "هاردات", icon: HardDrive },
  { label: "شاشات", icon: Monitor },
  { label: "أدوات مكتبية", icon: PenLine },
];

const services = [
  { title: "تركيب وتجهيز", description: "خلي أجهزتك تشتغل صح من أول يوم.", icon: Wrench, color: "mint" },
  { title: "نقل بيانات آمن", description: "ننقل ملفاتك من غير قلق أو وجع دماغ.", icon: PackageCheck, color: "peach" },
  { title: "اختيار على مقاسك", description: "مساعدة حقيقية قبل ما تضغطي شراء.", icon: Headphones, color: "lemon" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("كل المنتجات");
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = selectedCategory === "كل المنتجات" || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [selectedCategory, query]);

  const addToCart = (name: string) => {
    setCartCount((count) => count + 1);
    toast.success(`اتضاف ${name} للعربة`, { description: "تقدري تكملي التسوق أو تراجعي طلبك." });
  };

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#fbfaf7] text-[#172f3c]">
      <div className="top-strip"><div className="container flex items-center justify-between py-2 text-[11px] font-semibold"><span>توصيل مجاني للطلبات فوق ١٥٠٠ جنيه</span><span className="hidden sm:block">خصم ١٠٪ لأول طلب بكود FLUX10</span><span>خدمة العملاء: ١٦٠٤٤</span></div></div>
      <header className="sticky top-0 z-30 border-b border-[#e8e3da]/80 bg-[#fbfaf7]/92 backdrop-blur-xl">
        <div className="container flex h-[78px] items-center justify-between gap-5">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 text-[#38505b] hover:bg-white md:hidden" aria-label="فتح القائمة">{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <Link href="/" className="group flex items-center gap-3" dir="ltr"><span className="logo-mark"><img src="/manus-storage/fluxmart-mark_6d911004.png" alt="" /></span><span className="text-xl font-extrabold tracking-[-.05em]">Flux<span className="text-[#18a7a1]">Mart</span><small className="mr-2 hidden text-[9px] font-semibold tracking-[.12em] text-[#9b9b92] sm:inline">TECH &amp; MORE</small></span></Link>
          <nav className={`${mobileOpen ? "flex" : "hidden"} absolute inset-x-4 top-[70px] flex-col gap-1 rounded-2xl border border-[#e8e3da] bg-white p-3 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            {[["الرئيسية", "#home"], ["المتجر", "#products"], ["الخدمات", "#services"], ["عن FluxMart", "#about"]].map(([label, href], index) => <a key={label} href={href} onClick={() => setMobileOpen(false)} className={`${index === 0 ? "text-[#18a7a1]" : "text-[#52646c]"} rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-[#eaf8f6] hover:text-[#168e8a]`}>{label}</a>)}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3"><label className="search-box hidden sm:flex"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="دوري على اللي محتاجاه..." /></label><button onClick={() => toast.info("اكتبي اسم المنتج في خانة البحث")} className="rounded-full p-2 text-[#38505b] hover:bg-white sm:hidden"><Search size={20} /></button><button onClick={() => toast.info(cartCount ? `عندك ${cartCount} منتجات في العربة` : "العربة فاضية دلوقتي")} className="cart-button" aria-label="عربة التسوق"><ShoppingBag size={19} /><span>{cartCount}</span></button></div>
        </div>
      </header>

      <main id="home">
        <section className="container hero-grid"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14} /> أدواتك، بس بطريقتنا</span><h1>كل حاجة بتسهّل<br /><em>يومك</em> موجودة هنا.</h1><p>كاميرات، شاشات، هاردات وأدوات مكتب مختارة بعناية عشان تشتغلي، تبدعي، وتنجزي أكتر.</p><div className="flex flex-wrap gap-3"><a href="#products" className="primary-button">تصفحي المنتجات <ArrowLeft size={17} /></a><a href="#services" className="secondary-button">اعرفي خدماتنا</a></div><div className="hero-note"><Check size={17} /> منتجات أصلية · دعم حقيقي · توصيل سريع</div></div><div className="hero-visual"><div className="hero-shape"></div><img src="/manus-storage/fluxmart-hero_9574401e.jpg" alt="منتجات تقنية ومكتبية مختارة من FluxMart" /><span className="floating-note note-one">NEW<br /><b>اختيارات<br />مبهجة</b></span><span className="floating-note note-two">١٠٪<br /><b>خصم أول<br />طلب</b></span></div></section>
        <section className="container trust-row"><div><span className="trust-icon">↗</span><span><b>توصيل سريع</b><small>لباب البيت في ٢٤–٤٨ ساعة</small></span></div><div><span className="trust-icon">✓</span><span><b>ضمان حقيقي</b><small>على كل منتج من مصدر موثوق</small></span></div><div><span className="trust-icon">♡</span><span><b>اختيارات مفيدة</b><small>مش هنرشحلك حاجة مش محتاجاها</small></span></div><div className="hidden lg:flex"><span className="trust-icon">✦</span><span><b>دعم إنساني</b><small>بنرد عليك قبل وبعد الشراء</small></span></div></section>

        <section id="products" className="container section-block"><div className="catalog-label">CATALOG 01 <span>•</span> everyday tools</div><div className="section-heading"><div><span className="section-kicker">اختياراتنا ليكي</span><h2>المنتجات اللي بتفرق</h2></div><a href="#products" className="text-link">شوفي الكل <ArrowLeft size={16} /></a></div><div className="category-pills">{categories.map(({ label, icon: Icon }) => <button key={label} onClick={() => setSelectedCategory(label)} className={selectedCategory === label ? "active" : ""}><Icon size={17} />{label}</button>)}</div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className={`product-image ${product.tone}`}><span className="product-badge">{product.badge}</span><button onClick={() => toast.success("اتضاف لقائمة الأمنيات")} className="wish-button" aria-label="إضافة للمفضلة">♡</button><img src={product.image} alt={product.name} /></div><div className="product-info"><span>{product.category}</span><h3>{product.name}</h3><div className="price-row"><strong>{product.price.toLocaleString("ar-EG")} <small>ج.م</small></strong><del>{product.oldPrice.toLocaleString("ar-EG")}</del><button onClick={() => addToCart(product.name)} className="add-button" aria-label={`إضافة ${product.name} للعربة`}>+</button></div></div></article>)}</div>{filteredProducts.length === 0 && <div className="empty-state">مفيش منتجات بالبحث ده. جربي كلمة تانية أو اختاري كل المنتجات.</div>}</section>

        <section id="services" className="container service-banner"><div><span className="section-kicker">مش بس بنبيع</span><h2>نساعدك تخلي كل حاجة<br /><em>تشتغل صح.</em></h2><p>من أول الاختيار لحد التركيب ونقل البيانات، إحنا جنبك بخبرة بسيطة ومن غير كلام معقد.</p><a href="#about" className="primary-button">اكتشفي الخدمات <ArrowLeft size={17} /></a></div><div className="service-list">{services.map(({ title, description, icon: Icon, color }) => <div key={title} className={`service-card ${color}`}><span className="service-icon"><Icon size={22} /></span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpLeft size={18} className="service-arrow" /></div>)}</div></section>

        <section id="about" className="container about-section"><div className="about-sticker"><Laptop size={38} /><span>شغل<br />أحلى</span></div><div><span className="section-kicker">مين FluxMart؟</span><h2>متجر صغير،<br /><em>فكرة كبيرة.</em></h2></div><p>بنختار الحاجات اللي نحب نستخدمها بنفسنا: عملية، شكلها حلو، وتستاهل فلوسها. عشان تشتري وأنتِ مطمنة وتستخدميها كل يوم.</p><div className="about-stats"><b>+٢٥٠</b><span>منتج مختار</span><b>٤.٩</b><span>تقييم تجربة الشراء</span></div></section>
      </main>
      <footer><div className="container footer-main"><div><Link href="/" className="footer-logo" dir="ltr"><span className="logo-mark"><img src="/manus-storage/fluxmart-mark_6d911004.png" alt="" /></span><span>Flux<span>Mart</span></span></Link><p>كل عدة الشغل، في مكان واحد.<br />وبروح أخف.</p></div><div><h4>تسوقي</h4><a href="#products">كل المنتجات</a><a href="#products">الكاميرات</a><a href="#products">الشاشات</a></div><div><h4>ساعدي نفسك</h4><a href="#services">خدماتنا</a><a href="#about">عن FluxMart</a><a href="#home">تواصلي معنا</a></div><div className="footer-news"><h4>خليكي على الخط</h4><p>عروض جديدة واختيارات مفيدة، من غير زحمة.</p><div className="email-box"><input placeholder="إيميلك هنا" /><button onClick={() => toast.success("تم تسجيل إيميلك بنجاح")}>اشتركي</button></div></div></div><div className="container footer-bottom"><span>© ٢٠٢٦ FluxMart. معمول بحب.</span><span>الدفع آمن · الشحن سريع · الكلام واضح</span></div></footer>
    </div>
  );
}
