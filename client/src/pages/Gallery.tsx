import { motion } from "framer-motion";
import { MARKETING_IMAGES } from "@shared/site-content";

const images = MARKETING_IMAGES.gallery;

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/35 pt-24 pb-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold mb-4">A Visual Feast</h1>
          <p className="text-muted-foreground text-lg">Glimpses into our kitchen and dining room.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-xl aspect-square relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
              <img 
                src={src} 
                alt={`Gallery highlight ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(event) => {
                  event.currentTarget.src = MARKETING_IMAGES.homeFeatured[i % MARKETING_IMAGES.homeFeatured.length];
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
