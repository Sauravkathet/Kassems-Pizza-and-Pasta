import { MapPin, Clock, Truck } from "lucide-react";

export default function Contact() {
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.3613573388643!2d115.92405487543652!3d-31.978218274007606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bbf47f51caa9%3A0x71fff8dc45db42f1!2sKassems%20Pizza%20%26%20Pasta!5e0!3m2!1sen!2snp!4v1771048330554!5m2!1sen!2snp";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/35 pt-32 pb-32">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to welcome you to kassems pizza & pasta . Visit us for an unforgettable farm-to-table dining experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-10">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-semibold mb-3">Our Location</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    341 Orrong Rd<br/>
                    Kewdale, WA 6105
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-semibold mb-3">Business Hours</h3>
                  <div className="text-muted-foreground text-base space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Monday - Thursday</span>
                      <span>11:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Friday - Saturday</span>
                      <span>11:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Sunday</span>
                      <span>10:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <Truck className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-semibold mb-3">Delivery & Availability</h3>
                  <div className="space-y-2 text-base text-muted-foreground">
                    <p className="font-medium text-foreground">$4.99 Delivery Fee</p>
                    <p>Pricing & fees. Enter address to see delivery time.</p>
                    <p>Too far to deliver in some locations.</p>
                    <p className="font-medium text-foreground">Open until 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[500px] lg:h-[700px] bg-muted rounded-xl overflow-hidden shadow-xl border border-border">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="kassems pizza & pasta Location Map"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
