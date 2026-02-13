import { motion } from "framer-motion";
import { ArrowRight, Star, ChefHat, Leaf, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroVideo from "@assets/pizzavideo1.mp4";

export default function Home() {
  const heroPoster =
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroPoster}
            alt="Pizza oven background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
          >
            <source
              src={heroVideo}
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f5e8d6]/70 via-[#f5e8d6]/75 to-transparent md:h-52" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/62 to-black/48" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_45%)]" />
        </div>

        <div className="container relative z-20 mx-auto grid min-h-[88vh] items-center gap-8 px-4 py-20 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
           

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl md:text-5xl lg:text-6xl">
              Authentic Pizza & Pasta,
              <span className="block text-amber-200">Crafted Fresh Daily</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-white/90 md:text-lg">
              Wood-fired pizzas, house-made sauces, and classic Italian comfort food
              served fast without compromising quality.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                4.8 Guest Rating
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Avg. 30 Min Delivery
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Fresh Dough Daily
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/menu">
                <Button size="lg" className="h-12 rounded-full px-7 text-base shadow-lg">
                  View Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/order">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/50 bg-white/10 px-7 text-base text-white backdrop-blur-sm hover:bg-white/20"
                >
                  Order Online
                </Button>
              </Link>
            </div>
          </motion.div>

      
        </div>
      </section>

      {/* Intro Section */}
      <section className="relative bg-background py-20">
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
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Our Philosophy</h2>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Rooted in Tradition, <br/>Elevated by Passion.</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                At kassems pizza & pasta , we believe that the best meals start with the best ingredients. 
                Our chefs work directly with local farmers to source seasonal produce, ethical meats, 
                and artisanal goods.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Whether you're joining us for a casual brunch or a celebratory dinner, our goal 
                is to create a dining experience that feels both comforting and extraordinary.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-secondary">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold">Organic</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold">Artisan</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-3 text-foreground">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold">Community</h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Dishes (Mock) */}
      <section className="bg-white py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="mb-3 font-serif text-3xl font-bold text-foreground md:text-4xl">Seasonal Favorites</h2>
            <p className="text-sm text-muted-foreground md:text-base">Our menu changes with the seasons to ensure the freshest flavors.</p>
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
                <h3 className="mb-2 font-serif text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">{item.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{item.desc}</p>
                <Link href="/menu">
                  <span className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                    Order Now <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-secondary py-20 text-white">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div className="container px-4 mx-auto relative z-10 text-center">
          <Star className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="mb-4 font-serif text-3xl font-bold md:text-5xl">Planning a Special Event?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 md:text-lg">
            From intimate gatherings to grand weddings, let us bring the rustic charm and delicious flavors to your table.
          </p>
          <Link href="/catering">
            <Button size="lg" className="h-12 rounded-full bg-accent px-9 text-base font-bold text-accent-foreground hover:bg-accent/90">
              Inquire About Catering
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
