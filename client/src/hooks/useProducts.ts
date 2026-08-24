// SAFETY ENG product hook — تحميل حقيقي مع استمرار تجربة المتجر عند تعذر الشبكة.
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { products as localProducts, type Product } from "@/lib/store";

export function useProducts() {
  const [data, setData] = useState<Product[]>(localProducts);
  const [loading, setLoading] = useState(true);
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal)
      .then((remoteProducts) => {
        if (remoteProducts.length) {
          setData(remoteProducts);
          setIsRemote(true);
        }
      })
      .catch(() => {
        // Keep the curated SAFETY ENG catalog visible when API/CORS is unavailable.
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return { products: data, loading, isRemote };
}
