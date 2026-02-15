import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Order from "@/pages/Order";
import Catering from "@/pages/Catering";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Kitchen from "@/pages/Kitchen";
import Payment from "@/pages/Payment";
import TrackOrder from "@/pages/TrackOrder";
import Notices from "@/pages/Notices";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/not-found";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { TrackOrderDrawer } from "@/components/TrackOrderDrawer";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  const [location] = useLocation();
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const isKitchenRoute = location === "/kitchen";
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAdminRoute && (
        <Navigation
          isTrackOrderOpen={isTrackOrderOpen}
          onTrackOrderOpen={() => setIsTrackOrderOpen(true)}
        />
      )}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/notices" component={Notices} />
          <Route path="/order" component={Order} />
          <Route path="/payment" component={Payment} />
          <Route path="/track-order" component={TrackOrder} />
          <Route path="/catering" component={Catering} />
          <Route path="/about" component={About} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/contact" component={Contact} />
          <Route path="/kitchen" component={Kitchen} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isKitchenRoute && !isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <TrackOrderDrawer
          open={isTrackOrderOpen}
          onOpenChange={setIsTrackOrderOpen}
        />
      )}
      {!isAdminRoute && <CartDrawer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
