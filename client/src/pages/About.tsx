import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/35 pt-24 pb-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-widest uppercase font-medium">Our Story</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mt-4 mb-8">Crafted with Heart</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            kassems pizza & pasta  began with a simple idea: that the best food is honest, simple, and shared.
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
                src="https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/485765508_1475081340412619_9161493469473066723_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=xEuipd3nXtsQ7kNvwHwh799&_nc_oc=AdmPS27-zJy8pAu4KGnOSu0ONmnoh1ohZFyufGtaqFq2f5caFJDRN6JWzmYHANBqx-8&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=DYt4Gf2BHK-9yOBb6wIOkA&oh=00_AfuePbVfu527hjU-A0fEg37oa94ykOd2kT9QRIRlmU6WVQ&oe=69953E60" 
                alt="Our Suporters"
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
                src="https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/554694715_24701220746154991_1037812489477493969_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=0b6b33&_nc_ohc=Ws6zfPySp-4Q7kNvwG8IBnc&_nc_oc=AdmnZckyGYLzTe1hE0W4mDsTGqq_BCRbFb2XRB19fV_GQMMIJZ2_-7wNQHcovIV810A&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=niJQLP7ZonGq0d6tKCiSOg&oh=00_AftENZvCF7TufnSRoDz9RBBgpr8bmu4ZYEliucFcjKV08w&oe=69955DDD" 
                alt="quote image"
                className="rounded-lg shadow-lg w-full relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
