import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-widest uppercase font-medium">Our Story</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mt-4 mb-8">Crafted with Heart</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Rustic & Root began with a simple idea: that the best food is honest, simple, and shared.
          </p>
        </motion.div>

        <div className="space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-secondary/20 rounded-xl rotate-3" />
              {/* Unsplash: Woman holding vegetables */}
              <img 
                src="https://images.unsplash.com/photo-1595855709940-5776d65c3631?auto=format&fit=crop&q=80&w=800" 
                alt="Sourcing Ingredients"
                className="rounded-lg shadow-lg w-full relative z-10"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4 text-secondary">The Beginning</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in 2014 by Chef Elena Rossi, our kitchen is a tribute to the rustic farmhouses of her childhood. 
                Where meals weren't just eaten, they were celebrated. We carry that tradition forward by partnering with 
                local growers who share our commitment to sustainability and flavor.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
             <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl font-bold mb-4 text-primary">Our Promise</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe in transparency. You'll always know where your food comes from. 
                No shortcuts, no artificial additives—just pure, wholesome ingredients transformed by fire and skill. 
                Whether it's our sourdough starter that's been alive for 7 years or our slow-roasted meats, 
                patience is our secret ingredient.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute -inset-4 border-2 border-primary/20 rounded-xl -rotate-3" />
              {/* Unsplash: Hands kneading dough */}
              <img 
                src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80&w=800" 
                alt="Kneading Dough"
                className="rounded-lg shadow-lg w-full relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
