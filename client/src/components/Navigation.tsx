import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Menu, X, Truck } from "lucide-react";
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
  const isHomePage = location === "/";
  const isHeroNav = isHomePage && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/notices", label: "Notices" },
    { href: "/catering", label: "Catering" },
    { href: "/about", label: "Story" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b py-2.5 transition-all duration-300 md:py-3",
        isHeroNav
          ? "border-white/10 bg-black/90 backdrop-blur-md"
          : "border-white/15 bg-black shadow-[0_10px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/">
          <span className="inline-flex cursor-pointer items-center gap-2">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/35 bg-white/95 shadow-sm sm:h-11 sm:w-11 md:h-12 md:w-12",
                !isHeroNav && "border-primary/30 bg-orange-50",
              )}
            >
              <img
                src="/logo.png"
                alt="Kassems Pizza Logo"
                className="h-full w-full object-contain"
                loading="eager"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.src = "/favicon.png";
                }}
              />
            </span>
            <span
              className={cn(
                "hidden text-base font-semibold tracking-tight transition-colors sm:block md:text-lg lg:text-xl",
                isHeroNav ? "text-white drop-shadow-sm" : "text-secondary-foreground",
              )}
            >
              kassems pizza & pasta
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={cn(
                  "group relative cursor-pointer text-sm font-medium transition-colors",
                  location === link.href
                    ? isHeroNav
                      ? "text-primary"
                      : "text-primary"
                    : isHeroNav
                      ? "text-white/90 hover:text-white"
                      : "text-secondary-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  "bg-primary",
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
              "group relative rounded-full p-2 transition-colors",
              isTrackOrderActive
                ? isHeroNav
                  ? "bg-white/10"
                  : "bg-primary/12"
                : isHeroNav
                  ? "hover:bg-white/6"
                  : "hover:bg-secondary-foreground/6",
            )}
          >
            <Truck className={cn(
              "h-6 w-6 transition-colors",
              isHeroNav
                ? "text-white/90 group-hover:text-primary"
                : "text-secondary-foreground/90 group-hover:text-primary",
              isTrackOrderActive && "text-primary",
            )} />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "group relative rounded-full p-2 transition-colors",
              isHeroNav ? "hover:bg-white/6" : "hover:bg-secondary-foreground/6",
            )}
          >
            <ShoppingBag
              className={cn(
                "h-6 w-6 transition-colors",
                isHeroNav
                  ? "text-white/90 group-hover:text-primary"
                  : "text-secondary-foreground/90 group-hover:text-primary",
              )}
            />
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
              "rounded-full p-2 transition-colors",
              isTrackOrderActive
                ? isHeroNav
                  ? "bg-white/10"
                  : "bg-primary/12"
                : isHeroNav
                  ? "hover:bg-white/6"
                  : "hover:bg-secondary-foreground/6",
            )}
          >
            <Truck
              className={cn(
                "h-5 w-5",
                isHeroNav ? "text-white/90" : "text-secondary-foreground/90",
                isTrackOrderActive && "text-primary",
              )}
            />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative rounded-full p-2 transition-colors",
              isHeroNav ? "hover:bg-white/6" : "hover:bg-secondary-foreground/6",
            )}
          >
            <ShoppingBag className={cn("h-5 w-5", isHeroNav ? "text-white/90" : "text-secondary-foreground/90")} />
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
                ? "border-primary/30 bg-primary/8 text-primary"
                : isHeroNav
                  ? "border-white/35 bg-white/10 text-white hover:bg-white/12"
                  : "border-secondary-foreground/20 bg-secondary/80 text-secondary-foreground hover:bg-secondary/85"
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
              "relative rounded-full p-2 transition-colors",
              isTrackOrderActive
                ? isHeroNav
                  ? "bg-white/10"
                  : "bg-primary/12"
                : isHeroNav
                  ? "hover:bg-white/6"
                  : "hover:bg-secondary-foreground/6",
            )}
          >
            <Truck className={cn(
              "h-5 w-5",
              isHeroNav ? "text-white/90" : "text-secondary-foreground/90",
              isTrackOrderActive && "text-primary",
            )} />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative rounded-full p-2 transition-colors",
              isHeroNav ? "hover:bg-white/6" : "hover:bg-secondary-foreground/6",
            )}
          >
            <ShoppingBag className={cn("h-5 w-5", isHeroNav ? "text-white/90" : "text-secondary-foreground/90")} />
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
            className={cn(
              "rounded-lg border p-2 transition-colors",
              isHeroNav
                ? "border-white/35 bg-white/10 hover:bg-white/12"
                : "border-secondary-foreground/20 bg-secondary/80 hover:bg-secondary/85",
            )}
          >
            {mobileMenuOpen ? (
              <X className={cn("h-5 w-5", isHeroNav ? "text-white" : "text-secondary-foreground")} />
            ) : (
              <Menu className={cn("h-5 w-5", isHeroNav ? "text-white" : "text-secondary-foreground")} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile + Tablet Right Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-screen w-[86vw] max-w-sm flex-col border-l border-white/20 bg-black/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Navigation</p>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white/90 transition-colors hover:bg-white/6"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                          location === link.href
                            ? "border-primary/35 bg-primary/10 text-primary"
                            : "border-white/15 bg-white/[0.03] text-white/90 hover:bg-white/[0.05]"
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-7 space-y-2">
                  <button
                    onClick={() => {
                      onTrackOrderOpen();
                      setMobileMenuOpen(false);
                    }}
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                      isTrackOrderActive
                        ? "border-primary/35 bg-primary/10 text-primary"
                        : "border-white/15 bg-white/[0.03] text-white/90 hover:bg-white/[0.05]"
                    )}
                  >
                    <span>Track Order</span>
                    <Truck className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.05]"
                  >
                    <span>Basket</span>
                    <span className="inline-flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      {itemCount > 0 ? (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                          {itemCount}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
