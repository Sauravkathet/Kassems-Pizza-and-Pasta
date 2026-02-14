import { motion } from "framer-motion";
import { ArrowRight, Quote, ChefHat, Leaf, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroVideo from "@assets/pizzavideo1.mp4";

export default function Home() {
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 z-0">
       
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            
          >
            <source
              src={heroVideo}
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/40 to-transparent md:h-52" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/62 to-black/48" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_45%)]" />
        </div>

        <div className="container relative z-20 mx-auto grid min-h-[100svh] items-center gap-8 px-4 pb-12 pt-24 sm:pb-16 sm:pt-28 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
           

            <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
              Authentic Pizza & Pasta,
              <span className="block text-primary">Crafted Fresh Daily</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm text-white/90 sm:text-base md:mt-5 md:text-lg">
              Wood-fired pizzas, house-made sauces, and classic Italian comfort food
              served fast without compromising quality.
            </p>

         

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
      <section className="relative bg-white py-20">
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
                src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweqMO99yhA6m0TUyiikAUhYVFsGpgjYAO18SS4ELm4KV9g0m86Hy8tovujBsje0emNNtCa-HHpUP-WzQVbRNV59YrOFeRrC1zlazpqdyFdHheh_6xsLxPR86kfAcw2I2SZQB-y_9d7ihUb0=s1360-w1360-h1020" 
                alt="Chef Plating" 
                className="rounded-2xl shadow-2xl relative z-10 w-full"
              />
              <div className="absolute -bottom-8 -right-8 rounded-xl border border-black/15 bg-white/95 p-6 shadow-xl z-20 max-w-xs hidden md:block backdrop-blur-sm">
                <p className="font-serif text-lg italic text-black">"Food is our common ground, a universal experience."</p>
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
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-black">Rooted in Tradition, <br/>Elevated by Passion.</h3>
              <p className="text-base leading-relaxed text-black/70">
                At kassems pizza & pasta , we believe that the best meals start with the best ingredients. 
                Our chefs work directly with local farmers to source seasonal produce, ethical meats, 
                and artisanal goods.
              </p>
              <p className="text-base leading-relaxed text-black/70">
                Whether you're joining us for a casual brunch or a celebratory dinner, our goal 
                is to create a dining experience that feels both comforting and extraordinary.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 text-black">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold">Organic</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold">Artisan</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 text-black">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold">Community</h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="bg-white py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="mb-3 font-serif text-3xl font-bold text-black md:text-4xl">Pizza Favorites</h2>
            <p className="text-sm text-black/70 md:text-base">Top picks from our pizza menu, made fresh to order every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Chicken Paradiso",
                desc: "Tomato sauce, cheese, capsicum, crispy turkey, tomato, marinated chicken and garlic.",
                price: "A$19.00",
                // Unsplash: chicken pizza
                img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Meat Lovers",
                desc: "Tomato or BBQ sauce, cheese, beef, pepperoni and crispy turkey.",
                price: "A$19.00",
                // Unsplash: meat pizza
                img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Supreme",
                desc: "Tomato sauce, cheese, beef, onion, mushroom, pepperoni, crispy turkey, capsicum, tomatoes, pineapple and olives.",
                price: "A$19.00",
                // Unsplash: supreme pizza
                img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=800",
              },
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
                  <div className="absolute top-4 right-4 z-20 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-sm font-bold text-black shadow-lg backdrop-blur">
                    {item.price}
                  </div>
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">{item.title}</h3>
                <p className="mb-4 text-sm text-black/70">{item.desc}</p>
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
   <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 py-24 text-stone-800">
      {/* Sophisticated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(180,83,9,0.08),transparent_60%)]" />
      
      {/* Subtle kitchen texture (very faint) */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C7C5D' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center">
    
       
        {/* Main quote with elegant typography */}
        <h2 className="mx-auto max-w-4xl font-serif text-4xl font-light leading-tight tracking-tight text-stone-800 md:text-4xl lg:text-5xl">
          “Great pizza is simple:
          <br className="hidden sm:block" />
          <span className="font-medium text-orange-700">fire, time, and real ingredients.</span>”
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 md:text-xl">
          This is our promise for every order at Kassems Pizza & Pasta.
        </p>

        {/* Action buttons with refined hover effects */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link href="/order">
            <Button
              size="lg"
              className="h-14 rounded-full bg-red-600 px-10 text-base font-semibold text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-xl hover:shadow-orange-700/40"
            >
              Order Online
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/menu">
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-2 border-stone-300 bg-transparent px-10 text-base font-semibold text-stone-700 transition-all duration-300 hover:scale-105 hover:border-orange-600 hover:bg-orange-50 hover:text-orange-700"
            >
              View Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
}
