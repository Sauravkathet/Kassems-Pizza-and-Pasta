import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/">
              <span className="font-serif text-3xl font-bold text-primary cursor-pointer">kassems pizza & pasta </span>
            </Link>
            <p className="text-background/70 leading-relaxed">
              Serving farm-to-table cuisine with passion and rustic charm. We believe in the power of fresh ingredients and warm hospitality.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif text-xl font-bold text-accent">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/menu" className="text-background/70 hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link href="/catering" className="text-background/70 hover:text-primary transition-colors">Catering Services</Link></li>
              <li><Link href="/about" className="text-background/70 hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="text-background/70 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif text-xl font-bold text-accent">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span>123 Harvest Lane<br/>Portland, OR 97204</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@rusticandroot.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-serif text-xl font-bold text-accent">Hours</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-background/70">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-background">Monday - Thursday</p>
                  <p className="text-sm">11:00 AM - 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-background">Friday - Saturday</p>
                  <p className="text-sm">11:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-background">Sunday</p>
                  <p className="text-sm">10:00 AM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <p>&copy; {new Date().getFullYear()} kassems pizza & pasta . All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
