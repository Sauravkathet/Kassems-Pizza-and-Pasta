import { useMenu } from "@/hooks/use-menu";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Menu() {
  const { data: categories, isLoading, error } = useMenu();
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive">
        Error loading menu. Please try again.
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold text-foreground"
          >
            Our Menu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Carefully curated dishes celebrating seasonal ingredients and rustic flavors.
          </motion.p>
        </div>

        <div className="space-y-20">
          {categories?.map((category, catIndex) => (
            <motion.section 
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary">
                  {category.name}
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
                {category.items.map((item, itemIndex) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: itemIndex * 0.05 }}
                    className="group flex gap-4 md:gap-6"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-xl bg-muted shadow-md">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <span className="font-bold text-lg text-primary ml-2">${item.price}</span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 flex-1 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-2">
                          {item.isPopular && (
                            <Badge variant="secondary" className="bg-accent/40 text-foreground text-xs font-normal">Popular</Badge>
                          )}
                          {item.isVegetarian && (
                            <Badge variant="outline" className="border-green-600/30 text-green-700 text-xs font-normal">Veg</Badge>
                          )}
                          {item.isSpicy && (
                            <Badge variant="outline" className="border-red-500/30 text-red-600 text-xs font-normal">Spicy</Badge>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addToCart(item, 1)}
                          className="rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
