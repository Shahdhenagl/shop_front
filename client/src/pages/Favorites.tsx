// Style: ورق وبيكسل — قائمة مفضلة خفيفة تشبه لوحة اختيارات شخصية.
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { formatPrice, products, readIds, saveIds } from "@/lib/store";

export default function Favorites() {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => setIds(readIds("fluxmart-favorites")), []);
  const favoriteProducts = products.filter((product) => ids.includes(product.id));
  const remove = (id: number) => { const next = ids.filter((item) => item !== id); setIds(next); saveIds("fluxmart-favorites", next); toast.success("اتشال من المفضلة"); };
  const addCart = (id: number) => { const cart = readIds("fluxmart-cart"); saveIds("fluxmart-cart", [...cart, id]); toast.success("اتضاف للعربة"); };
  return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><header className="inner-header"><div className="container flex items-center justify-between"><Link href="/" className="brand-lockup" dir="ltr"><span className="logo-mark"><img src="/manus-storage/fluxmart-mark_6d911004.png" alt="" /></span><b>SAFETY<span> ENG</span></b></Link><Link href="/cart" className="icon-link"><ShoppingBag size={19} /> العربة</Link></div></header><main className="container page-shell"><span className="section-kicker"><Heart size={14} /> اختياراتك المحفوظة</span><h1>قائمة المفضلة</h1><p className="page-intro">الحاجات اللي عجبِتك محفوظة هنا لحد ما تكوني جاهزة.</p>{favoriteProducts.length ? <div className="favorite-grid">{favoriteProducts.map((product) => <article className="favorite-card" key={product.id}><Link href={`/product/${product.id}`} className={`favorite-image ${product.tone}`}><img src={product.image} alt={product.name} /></Link><div><span>{product.category}</span><h2>{product.name}</h2><b className="favorite-price">{formatPrice(product.price)}</b><div className="favorite-actions"><button onClick={() => addCart(product.id)} className="primary-button">أضيفي للعربة <ShoppingBag size={15} /></button><button onClick={() => remove(product.id)} className="remove-button" aria-label="إزالة من المفضلة"><Trash2 size={16} /></button></div></div></article>)}</div> : <div className="empty-state large-empty"><Heart size={38} /><h2>لسه مفيش اختيارات</h2><p>اضغطي على القلب في أي منتج عجبك وهيظهر هنا.</p><Link href="/" className="primary-button">روحي للمتجر</Link></div>}</main></div>;
}
