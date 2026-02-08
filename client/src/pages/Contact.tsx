import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container px-4 mx-auto">
        <h1 className="font-serif text-5xl font-bold text-center mb-16">Visit Us</h1>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold mb-2">Location</h3>
                <p className="text-muted-foreground text-lg">
                  123 Harvest Lane<br/>
                  Portland, OR 97204
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold mb-2">Hours</h3>
                <div className="text-muted-foreground text-lg space-y-1">
                  <p><span className="font-medium text-foreground">Mon - Thu:</span> 11:00 AM - 9:00 PM</p>
                  <p><span className="font-medium text-foreground">Fri - Sat:</span> 11:00 AM - 10:00 PM</p>
                  <p><span className="font-medium text-foreground">Sun:</span> 10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-accent/30 text-foreground rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold mb-2">Contact</h3>
                <p className="text-muted-foreground text-lg">
                  (555) 123-4567<br/>
                  hello@rusticandroot.com
                </p>
              </div>
            </div>
          </div>

          <div className="h-[400px] md:h-[600px] bg-muted rounded-2xl overflow-hidden shadow-lg border border-border/50">
             {/* Embed a Google Map iframe mock */}
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.1465229344265!2d-122.67648168465036!3d45.52024767910166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950a0b7310d519%3A0xc3224e7855364177!2sPioneer%20Courthouse%20Square!5e0!3m2!1sen!2sus!4v1645564858585!5m2!1sen!2sus" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy"
               title="Map"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
