// Style: SAFETY ENG — إضافة السلة تؤكد الفعل فورًا، وتُزامن مع Laravel فقط عندما تتوفر هوية وvariant صالح.
/* Style: SAFETY ENG — مزامنة العربة تعطي الهيدر تأكيدًا فوريًا بعد كل إضافة أو تغيير محلي. */
import { addCartItem, hasAuthToken } from "./api";
import { getInstallationFee, readCartEntries, saveCartEntries, type CartEntry, type Product } from "./store";

export async function addProductToCart(product: Product, quantity = 1, installationRequested = false) {
  const entries = readCartEntries();
  const existing = entries.find((line) => line.productId === product.id && line.installationRequested === installationRequested);
  const next: CartEntry[] = existing
    ? entries.map((line) => line === existing ? { ...line, quantity: line.quantity + quantity, variantId: product.variantId ?? line.variantId } : line)
    : [...entries, { productId: product.id, variantId: product.variantId, quantity, installationRequested, installationFee: installationRequested ? getInstallationFee(product) : 0 }];
  saveCartEntries(next);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("safety-cart-updated"));

  if (hasAuthToken() && product.variantId) {
    await addCartItem(product.variantId, quantity);
    return { next, cloudSynced: true };
  }
  return { next, cloudSynced: false };
}
