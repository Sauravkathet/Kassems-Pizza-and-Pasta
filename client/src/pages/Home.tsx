import { motion } from "framer-motion";
import { ArrowRight, Star, ChefHat, Leaf, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
            alt="Pizza oven background"
            className="h-full w-full object-cover"
          />
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
          >
            <source
              src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_45%)]" />
        </div>

        <div className="container relative z-20 mx-auto grid min-h-[92vh] items-center gap-10 px-4 py-24 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-amber-300" />
              Family Owned Since 2014
            </span>

            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl md:text-7xl">
              Authentic Pizza & Pasta,
              <span className="block text-amber-200">Crafted Fresh Daily</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
              Wood-fired pizzas, house-made sauces, and classic Italian comfort food
              served fast without compromising quality.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                4.8 Guest Rating
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                Avg. 30 Min Delivery
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                Fresh Dough Daily
              </span>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/menu">
                <Button size="lg" className="h-14 rounded-full px-8 text-lg shadow-lg">
                  View Menu <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/order">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-white/50 bg-white/10 px-8 text-lg text-white backdrop-blur-sm hover:bg-white/20"
                >
                  Order Online
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl border border-white/20 bg-black/35 p-6 text-white backdrop-blur-md"
          >
            <h2 className="font-serif text-2xl font-bold">Now Serving</h2>
            <p className="mt-1 text-sm text-white/80">Dine-in, pickup, and delivery</p>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                <span>Today</span>
                <span className="font-semibold">11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                <span>Phone</span>
                <span className="font-semibold">(555) 123-4567</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                <span>Address</span>
                <span className="font-semibold">Portland, OR</span>
              </div>
            </div>
            <Link href="/contact">
              <Button
                variant="secondary"
                className="mt-6 h-11 w-full rounded-full bg-white text-black hover:bg-white/90"
              >
                View Full Details
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-background relative">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              {/* Unsplash: Chef plating food */}
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000" 
                alt="Chef Plating" 
                className="rounded-2xl shadow-2xl relative z-10 w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs hidden md:block">
                <p className="font-serif text-lg italic text-foreground">"Food is our common ground, a universal experience."</p>
                <p className="text-sm text-primary mt-2 font-bold">- James Beard</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-primary font-medium tracking-widest uppercase">Our Philosophy</h2>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Rooted in Tradition, <br/>Elevated by Passion.</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At kassems pizza & pasta , we believe that the best meals start with the best ingredients. 
                Our chefs work directly with local farmers to source seasonal produce, ethical meats, 
                and artisanal goods.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're joining us for a casual brunch or a celebratory dinner, our goal 
                is to create a dining experience that feels both comforting and extraordinary.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-secondary">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold">Organic</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold">Artisan</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-3 text-foreground">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold">Community</h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Dishes (Mock) */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4 text-foreground">Seasonal Favorites</h2>
            <p className="text-muted-foreground">Our menu changes with the seasons to ensure the freshest flavors.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Roasted Rack of Lamb",
                desc: "Herb-crusted lamb with rosemary potatoes and mint glaze.",
                price: "$32",
                // Unsplash: Lamb dish
                img: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=800" 
              },
              {
                title: "Wild Mushroom Risotto",
                desc: "Arborio rice, porcini mushrooms, parmesan crisp, truffle oil.",
                price: "$24",
                // Unsplash: Risotto
                img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Pan-Seared Scallops",
                desc: "Jumbo scallops, cauliflower purée, crispy pancetta, lemon butter.",
                price: "$28",
                // Unsplash: Scallops
                img: "https://images.unsplash.com/photo-1548592358-8b9a957b4c48?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-2xl mb-4 aspect-[4/3] relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                    {item.price}
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.desc}</p>
                <Link href="/menu">
                  <span className="inline-flex items-center text-primary font-medium hover:underline">
                    Order Now <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div className="container px-4 mx-auto relative z-10 text-center">
          <Star className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">Planning a Special Event?</h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            From intimate gatherings to grand weddings, let us bring the rustic charm and delicious flavors to your table.
          </p>
          <Link href="/catering">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 h-14 text-lg font-bold">
              Inquire About Catering
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
