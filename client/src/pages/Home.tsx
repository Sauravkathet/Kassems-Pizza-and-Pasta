import { motion } from "framer-motion";
import { ArrowRight, Star, ChefHat, Leaf, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
             {/* Unsplash: Dark, moody rustic kitchen with ingredients on table */}
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=2000" 
              alt="Rustic Kitchen" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="container relative z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/90 text-sm font-medium tracking-widest uppercase mb-6 backdrop-blur-sm">
              Est. 2014
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-2xl"
          >
            Taste the <span className="text-primary italic">Wild</span> & <br/>
            Savor the <span className="text-accent italic">Roots</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light"
          >
            Experience authentic farm-to-table dining where every ingredient tells a story. 
            Locally sourced, expertly crafted, and served with soul.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/menu">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
                View Menu <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/40 text-white backdrop-blur-sm rounded-full px-8 h-14 text-lg">
                Order Online
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll to Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
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
                At Rustic & Root, we believe that the best meals start with the best ingredients. 
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
