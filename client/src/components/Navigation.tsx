import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X, ChefHat, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type NavigationProps = {
  isTrackOrderOpen: boolean;
  onTrackOrderOpen: () => void;
};

export function Navigation({ isTrackOrderOpen, onTrackOrderOpen }: NavigationProps) {
  const [location] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTrackOrderActive = isTrackOrderOpen || location.startsWith("/track-order");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/catering", label: "Catering" },
    { href: "/about", label: "Story" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-transparent transition-all duration-300",
        isScrolled || mobileMenuOpen
          ? "border-border/40 bg-background/95 py-2.5 shadow-sm backdrop-blur-md md:py-3"
          : "bg-transparent py-5 md:border-border/20 md:bg-background/72 md:py-3 md:backdrop-blur-md"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/">
          <span className="cursor-pointer font-serif text-xl font-bold tracking-tighter text-primary sm:text-2xl lg:text-3xl">
            kassems pizza & pasta 
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={cn(
                  "group relative cursor-pointer text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100",
                  location === link.href && "scale-x-100"
                )} />
              </span>
            </Link>
          ))}
          <button
            onClick={onTrackOrderOpen}
            type="button"
            title="Track Order"
            aria-label="Track Order"
            className={cn(
              "group relative rounded-full p-2 transition-colors hover:bg-secondary/10",
              isTrackOrderActive && "bg-secondary/20"
            )}
          >
            <Truck className={cn(
              "h-6 w-6 text-foreground transition-colors group-hover:text-primary",
              isTrackOrderActive && "text-primary"
            )} />
          </button>
          <Link href="/kitchen">
            <span
              title="Kitchen"
              aria-label="Kitchen"
              className={cn(
                "group relative cursor-pointer rounded-full p-2 transition-colors hover:bg-secondary/10",
                location === "/kitchen" && "bg-secondary/20"
              )}
            >
              <ChefHat className={cn(
                "h-6 w-6 text-foreground transition-colors group-hover:text-primary",
                location === "/kitchen" && "text-primary"
              )} />
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="group relative rounded-full p-2 transition-colors hover:bg-secondary/10"
          >
            <ShoppingBag className="h-6 w-6 text-foreground transition-colors group-hover:text-primary" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Tablet Nav */}
        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <button
            onClick={onTrackOrderOpen}
            type="button"
            title="Track Order"
            aria-label="Track Order"
            className={cn(
              "rounded-full p-2 transition-colors hover:bg-secondary/10",
              isTrackOrderActive && "bg-secondary/20"
            )}
          >
            <Truck className={cn("h-5 w-5 text-foreground", isTrackOrderActive && "text-primary")} />
          </button>
          <Link href="/kitchen">
            <span
              title="Kitchen"
              aria-label="Kitchen"
              className={cn(
                "cursor-pointer rounded-full p-2 transition-colors hover:bg-secondary/10",
                location === "/kitchen" && "bg-secondary/20"
              )}
            >
              <ChefHat className={cn("h-5 w-5 text-foreground", location === "/kitchen" && "text-primary")} />
            </span>
          </Link>
          <button onClick={() => setIsOpen(true)} className="relative rounded-full p-2 transition-colors hover:bg-secondary/10">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
              mobileMenuOpen
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/60 bg-background/80 text-foreground hover:bg-muted/60"
            )}
          >
            {mobileMenuOpen ? (
              <span className="inline-flex items-center gap-1.5">
                <X className="h-3.5 w-3.5" />
                Close
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Menu className="h-3.5 w-3.5" />
                Menu
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onTrackOrderOpen}
            type="button"
            title="Track Order"
            aria-label="Track Order"
            className={cn(
              "relative rounded-full p-2 hover:bg-secondary/10",
              isTrackOrderActive && "bg-secondary/20"
            )}
          >
            <Truck className={cn(
              "h-5 w-5 text-foreground",
              isTrackOrderActive && "text-primary"
            )} />
          </button>
          <Link href="/kitchen">
            <span
              title="Kitchen"
              aria-label="Kitchen"
              className={cn(
                "relative cursor-pointer rounded-full p-2 hover:bg-secondary/10",
                location === "/kitchen" && "bg-secondary/20"
              )}
            >
              <ChefHat className={cn(
                "h-5 w-5 text-foreground",
                location === "/kitchen" && "text-primary"
              )} />
            </span>
          </Link>
          <button onClick={() => setIsOpen(true)} className="relative rounded-full p-2 hover:bg-secondary/10">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="rounded-lg border border-border/60 bg-background/80 p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile + Tablet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/40 bg-background/95 shadow-sm backdrop-blur-md lg:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={cn(
                        "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                      location === link.href
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 bg-background/70 text-foreground hover:bg-muted/60"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onTrackOrderOpen();
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold",
                    isTrackOrderActive
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-background/70 text-foreground"
                  )}
                >
                  <Truck className="h-3.5 w-3.5" />
                  Track
                </button>
                <Link href="/kitchen">
                  <span
                    className={cn(
                      "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold",
                      location === "/kitchen"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 bg-background/70 text-foreground"
                    )}
                  >
                    <ChefHat className="h-3.5 w-3.5" />
                    Kitchen
                  </span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs font-semibold text-foreground"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Cart
                  {itemCount > 0 ? `(${itemCount})` : ""}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
