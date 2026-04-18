import { MapPin, ChefHat, Phone } from "lucide-react";
import {
  SITE_ADDRESS_LINE_ONE,
  SITE_ADDRESS_LINE_TWO,
  SITE_INSTAGRAM_HANDLE,
  SITE_INSTAGRAM_URL,
  SITE_LOCATION_NOTE,
  SITE_MAP_QUERY,
  SITE_NAME,
  SITE_SUPPORT_EMAIL,
  SITE_SUPPORT_PHONE,
} from "@shared/site-content";

export default function Contact() {
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(SITE_MAP_QUERY)}&output=embed`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/35 pt-32 pb-32">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;d love to bring {SITE_NAME} to your event. Book flame-fired catering across Perth with a fully mobile setup.
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
                    {SITE_ADDRESS_LINE_ONE}
                    <br />
                    {SITE_ADDRESS_LINE_TWO}
                    <br />
                    {SITE_LOCATION_NOTE}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center shrink-0">
                  <ChefHat className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-semibold mb-3">Services</h3>
                  <div className="text-muted-foreground text-base space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Live Station</span>
                      <span>Stone-fired pizza on-site</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Weddings & Events</span>
                      <span>Custom catering</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Experience</span>
                      <span>50+ events catered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-semibold mb-3">Bookings</h3>
                  <div className="space-y-2 text-base text-muted-foreground">
                    <p className="font-medium text-foreground">Book via DM</p>
                    <p>
                      <a className="underline hover:text-primary" href={`mailto:${SITE_SUPPORT_EMAIL}`}>
                        {SITE_SUPPORT_EMAIL}
                      </a>
                    </p>
                    <p>
                      <a className="underline hover:text-primary" href={`tel:${SITE_SUPPORT_PHONE.replace(/\s+/g, "")}`}>
                        {SITE_SUPPORT_PHONE}
                      </a>
                    </p>
                    <p>
                      Instagram:{" "}
                      <a className="underline hover:text-primary" href={SITE_INSTAGRAM_URL}>
                        {SITE_INSTAGRAM_HANDLE}
                      </a>
                    </p>
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
              title={`${SITE_NAME} location map`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
