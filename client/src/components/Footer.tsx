import { Link } from "wouter";
import { Instagram, MapPin, Clock, Phone, Mail } from "lucide-react";
import {
  BRAND_IMAGES,
  SITE_LOCATION_SUMMARY,
  SITE_NAME,
  SITE_SHORT_NAME,
} from "@shared/site-content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/100 bg-black/90 pb-8 pt-16 text-secondary-foreground">
      <div className="container relative mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl  shadow-sm">
                <img
                  src={BRAND_IMAGES.logo}
                  alt={`${SITE_SHORT_NAME} logo`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.src = BRAND_IMAGES.logoFallback;
                  }}
                />
              </div>
              <div className="min-w-0">
                <Link href="/">
                  <span className="block cursor-pointer text-2xl font-semibold tracking-tight text-secondary-foreground transition-colors hover:text-primary">
                    {SITE_NAME}
                  </span>
                </Link>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  Halal stone-fired pizza
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-secondary-foreground/70">
              Perth's flame-fired pizza experience with pasta, grill favorites, and catering for every kind of gathering.
              Dine in, grab takeaway, or book us for local events.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/s.r.pizza"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-secondary-foreground/80 transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="border-l-4 border-primary pl-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/menu" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Our Menu</Link></li>
              <li><Link href="/notices" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Notice Board</Link></li>
              <li><Link href="/catering" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Catering Services</Link></li>
              <li><Link href="/about" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Our Story</Link></li>
              <li><Link href="/contact" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Contact Us</Link></li>
              <li><Link href="/admin/login" className="inline-block text-sm text-secondary-foreground/70 transition-colors hover:text-primary">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="border-l-4 border-primary pl-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{SITE_LOCATION_SUMMARY}<br/>Local dine-in and catering</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>+61 415 743 566</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <span>shehzadraffikpizza@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="border-l-4 border-primary pl-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary-foreground">Services</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Live Station</p>
                  <p className="text-secondary-foreground/70">Stone-fired pizza on-site.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Weddings & Events</p>
                  <p className="text-secondary-foreground/70">Custom catering for all sizes.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Mobile Set-Up</p>
                  <p className="text-secondary-foreground/70">Backyards, garages, offices.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground/80" />
                <div className="text-sm">
                  <p className="font-semibold text-secondary-foreground">Experience</p>
                  <p className="text-secondary-foreground/70">50+ events catered.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-secondary-foreground/70 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-primary">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
