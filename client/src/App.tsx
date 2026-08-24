// Style: اتجاه «ورق وبيكسل» — كل مسارات المتجر تحافظ على نفس الهوية الفاتحة والـ RTL.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
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

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/shop" component={Shop} /><Route path="/product/:id" component={ProductDetails} /><Route path="/favorites" component={Favorites} /><Route path="/cart" component={Cart} /><Route path="/checkout" component={Checkout} /><Route path="/auth" component={Auth} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster position="top-center" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
