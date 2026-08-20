// Style: ورق وبيكسل — تفاصيل المنتج كصفحة كتالوج دافئة مع CTA واضح وموتيفات ورقية.
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Check, Heart, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, getProduct, readIds, saveIds } from "@/lib/store";

export default function ProductDetails() {
  const [, navigate] = useLocation();
  const id = window.location.pathname.split("/").pop() || "1";
  const product = getProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(() => product ? readIds("fluxmart-favorites").includes(product.id) : false);

  if (!product) return <div dir="rtl" className="empty-page"><h1>المنتج مش موجود</h1><Link href="/">ارجعي للمتجر</Link></div>;

  const toggleFavorite = () => {
    const ids = readIds("fluxmart-favorites");
    const next = ids.includes(product.id) ? ids.filter((item) => item !== product.id) : [...ids, product.id];
    saveIds("fluxmart-favorites", next); setFavorite(!favorite); toast.success(!favorite ? "اتضاف للمفضلة" : "اتشال من المفضلة");
  };
  const addCart = () => { const cart = readIds("fluxmart-cart"); saveIds("fluxmart-cart", [...cart, ...Array(quantity).fill(product.id)]); toast.success("اتضاف للعربة"); };

  return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><header className="inner-header"><div className="container flex items-center justify-between"><Link href="/" className="brand-lockup" dir="ltr"><span className="logo-mark"><img src="/manus-storage/fluxmart-mark_6d911004.png" alt="" /></span><b>Flux<span>Mart</span></b></Link><div className="inner-actions"><Link href="/favorites" className="icon-link"><Heart size={19} /> المفضلة</Link><Link href="/cart" className="icon-link"><ShoppingBag size={19} /> العربة</Link></div></div></header>
    <main className="container detail-page"><Link href="/" className="back-link"><ArrowRight size={16} /> رجوع للمتجر</Link><div className="detail-layout"><div className={`detail-image ${product.tone}`}><span className="product-badge">{product.badge}</span><img src={product.image} alt={product.name} /></div><div className="detail-copy"><span className="section-kicker"><Sparkles size={14} /> {product.category}</span><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="detail-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del></div><div className="detail-divider" /><div className="detail-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="primary-button detail-cart" onClick={addCart}>أضيفي للعربة <ShoppingBag size={17} /></button><button className={`favorite-button ${favorite ? "is-favorite" : ""}`} onClick={toggleFavorite} aria-label="إضافة للمفضلة"><Heart size={20} fill={favorite ? "currentColor" : "none"} /></button></div><div className="detail-promise"><Check size={17} /><span><b>متوفر للشحن السريع</b><small>ضمان واستبدال سهل خلال 14 يوم</small></span></div><div className="specs"><h3>التفاصيل السريعة</h3>{product.specs.map((spec) => <div key={spec}><Check size={15} />{spec}</div>)}</div></div></div></main></div>;
}
