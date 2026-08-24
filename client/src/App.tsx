// Style: اتجاه «ورق وبيكسل» — كل مسارات المتجر تحافظ على نفس الهوية الفاتحة والـ RTL.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import Orders from "./pages/Orders";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = "auto";
      };
    }
  }, []);

  return null;
}

function Router() {
  return <><ScrollToTop /><Switch><Route path="/" component={Home} /><Route path="/shop" component={Shop} /><Route path="/product/:id" component={ProductDetails} /><Route path="/favorites" component={Favorites} /><Route path="/cart" component={Cart} /><Route path="/checkout" component={Checkout} /><Route path="/auth" component={Auth} /><Route path="/contact" component={Contact} /><Route path="/search" component={SearchResults} /><Route path="/orders" component={Orders} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></>;
}
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster position="top-center" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
