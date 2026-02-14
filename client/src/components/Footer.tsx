import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Clock, Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/100 bg-black/90 pb-8 pt-16 text-secondary-foreground">
      <div className="container relative mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl  shadow-sm">
                <img
                  src="/logo.png"
                  alt="Kassems Pizza Logo"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.src = "/favicon.png";
                  }}
                />
              </div>
              <div className="min-w-0">
                <Link href="/">
                  <span className="block cursor-pointer text-2xl font-semibold tracking-tight text-secondary-foreground transition-colors hover:text-primary">
                    Kassems Pizza & Pasta
                  </span>
                </Link>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  Wood-fired kitchen
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-secondary-foreground/70">
              Authentic Italian flavors crafted with passion. From our oven to your table, we serve quality pizzas and fresh pasta using premium ingredients and traditional recipes.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-secondary-foreground/80 transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-secondary-foreground/80 transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-secondary-foreground/80 transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="border-l-4 border-primary pl-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/menu" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Our Menu</Link></li>
              <li><Link href="/catering" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Catering Services</Link></li>
              <li><Link href="/about" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Our Story</Link></li>
              <li><Link href="/contact" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="border-l-4 border-primary pl-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>341 Orrong Rd<br/>Kewdale, WA 6105</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-secondary-foreground">$4.99 Delivery Fee</p>
                  <p className="text-secondary-foreground/70">Pricing & fees. Enter address to see delivery time.</p>
                  <p className="text-secondary-foreground/70">Too far to deliver in some locations.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <span>Open until 7:00 PM</span>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="border-l-4 border-primary pl-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Sunday</p>
                  <p className="text-secondary-foreground/70">11:30 AM - 9:15 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Monday - Wednesday</p>
                  <p className="text-secondary-foreground/70">11:30 AM - 8:45 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Thursday</p>
                  <p className="text-secondary-foreground/70">11:30 AM - 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Friday - Saturday</p>
                  <p className="text-secondary-foreground/70">11:30 AM - 9:15 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-secondary-foreground/70 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Kassems Pizza & Pasta. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
