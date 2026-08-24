// Style: ورق وبيكسل — سلة واضحة ومطمئنة بخطوات شراء قصيرة.
import SiteFooter from "@/components/SiteFooter";
import InnerHeader from "@/components/InnerHeader";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { formatPrice, getInstallationFee, getProduct, products, readCartEntries, saveCartEntries, type CartEntry } from "@/lib/store";

type CartLine = { id: number; quantity: number };
export default function Cart() {
  const [lines, setLines] = useState<CartEntry[]>([]);
  useEffect(() => setLines(readCartEntries()), []);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + (getProduct(line.productId)?.price || 0) * line.quantity, 0), [lines]);
  const installationTotal = useMemo(() => lines.reduce((sum, line) => sum + (line.installationRequested ? (line.installationFee || getInstallationFee(getProduct(line.productId)!)) * line.quantity : 0), 0), [lines]);
  const total = subtotal + installationTotal;
  const persist = (next: CartEntry[]) => { setLines(next); saveCartEntries(next); };
  const change = (id: number, delta: number) => { persist(lines.map((line) => line.productId === id ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line).filter((line) => line.quantity)); };
  const remove = (id: number) => { persist(lines.filter((line) => line.productId !== id)); toast.success("اتشال من العربة"); };
  return <div dir="rtl" className="min-h-screen bg-[#fbfaf7] text-[#172f3c]"><InnerHeader /><main className="container page-shell"><span className="section-kicker"><ShoppingBag size={14} /> خطوة قبل ما توصلك</span><h1>سلة مشترياتك</h1>{lines.length ? <div className="cart-layout"><div className="cart-lines">{lines.map((line) => { const product = products.find((item) => item.id === line.productId); if (!product) return null; return <article className="cart-line" key={`${line.productId}-${line.installationRequested}`}><Link href={`/product/${line.productId}`} className={`cart-line-image ${product.tone}`}><img src={product.image} alt={product.name} /></Link><div className="cart-line-copy"><span>{product.category}</span><h2>{product.name}</h2><b>{formatPrice(product.price)}</b>{line.installationRequested && <small className="cart-installation-line">+ تركيب: {formatPrice(line.installationFee)}</small>}</div><div className="quantity"><button onClick={() => change(line.productId, -1)}><Minus size={15} /></button><b>{line.quantity}</b><button onClick={() => change(line.productId, 1)}><Plus size={15} /></button></div><button className="remove-button" onClick={() => remove(line.productId)} aria-label="حذف المنتج"><Trash2 size={17} /></button></article>; })}</div><aside className="summary-card"><span>ملخص الطلب</span><h2>{formatPrice(total)}</h2><div><small>المنتجات</small><b>{formatPrice(subtotal)}</b></div><div><small>التركيب</small><b>{installationTotal ? formatPrice(installationTotal) : "بدون تركيب"}</b></div><div><small>الشحن</small><b>{total >= 1500 ? "مجاني" : "50 ج.م"}</b></div><div className="summary-total"><small>الإجمالي المتوقع</small><b>{formatPrice(total + (total >= 1500 ? 0 : 50))}</b></div><Link href="/checkout" className="primary-button checkout-button">إتمام الطلب <ArrowLeft size={17} /></Link><p>الدفع عند الاستلام متاح. بياناتك في أمان.</p></aside></div> : <div className="empty-state large-empty"><ShoppingBag size={38} /><h2>العربة فاضية</h2><p>اختاري حاجاتك المفضلة وابدئي أول طلب.</p><Link href="/" className="primary-button">تصفحي المنتجات</Link></div>}</main><SiteFooter /></div>;
}
