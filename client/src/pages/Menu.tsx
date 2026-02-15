import { useMemo, useState } from "react";
import { useMenu } from "@/hooks/use-menu";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";
import { ChevronDown, Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fallbackImageByName, resolveItemImage } from "@/lib/item-image";
import { cn } from "@/lib/utils";

export default function Menu() {
  const { data: categories, isLoading, error } = useMenu();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<Record<number, boolean>>({});

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!categories) {
      return [];
    }

    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const name = item.name.toLowerCase();
          const description = item.description.toLowerCase();
          return name.includes(normalizedQuery) || description.includes(normalizedQuery);
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, normalizedQuery]);

  const visibleItemsCount = filteredCategories.reduce((count, category) => count + category.items.length, 0);

  const isCategoryCollapsed = (categoryId: number, categoryIndex: number) => {
    if (normalizedQuery) {
      return false;
    }

    const explicitState = collapsedCategoryIds[categoryId];
    if (typeof explicitState === "boolean") {
      return explicitState;
    }

    return categoryIndex !== 0;
  };

  const toggleCategoryCollapsed = (categoryId: number, categoryIndex: number) => {
    setCollapsedCategoryIds((previous) => {
      const explicitState = previous[categoryId];
      const currentlyCollapsed = typeof explicitState === "boolean" ? explicitState : categoryIndex !== 0;
      return {
        ...previous,
        [categoryId]: !currentlyCollapsed,
      };
    });
  };

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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="sticky top-16 z-30 mb-12 w-full rounded-2xl border border-border/70 bg-background/95 px-3 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85 md:top-20"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search menu items..."
              className="h-12 rounded-full border-border pl-11 pr-12 text-base shadow-sm"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {normalizedQuery && (
            <p className="mt-2 px-2 text-sm text-muted-foreground">
              {visibleItemsCount > 0
                ? `Showing ${visibleItemsCount} result${visibleItemsCount === 1 ? "" : "s"} for "${searchQuery.trim()}".`
                : `No items found for "${searchQuery.trim()}".`}
            </p>
          )}
        </motion.div>

        <div className="space-y-20">
          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center">
              <h3 className="font-serif text-2xl font-semibold text-foreground">No matching menu items</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different keyword like pepperoni, pasta, or salad.
              </p>
            </div>
          ) : (
            filteredCategories.map((category, catIndex) => {
              const isCollapsed = isCategoryCollapsed(category.id, catIndex);

              return (
                <motion.section
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: catIndex * 0.03 }}
                >
                  <div className="mb-8 flex items-center gap-4">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary">
                      {category.name}
                    </h2>
                    <div className="h-[1px] flex-1 bg-border" />
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden"
                      aria-expanded={!isCollapsed}
                      onClick={() => toggleCategoryCollapsed(category.id, catIndex)}
                    >
                      {isCollapsed ? "Show" : "Hide"}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", !isCollapsed && "rotate-180")}
                      />
                    </button>
                  </div>

                  <div className={cn("grid gap-x-8 gap-y-12 md:grid-cols-2", isCollapsed && "hidden md:grid")}>
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
                            src={resolveItemImage(item.name, item.imageUrl)}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(event) => {
                              const target = event.currentTarget;
                              target.onerror = null;
                              target.src = fallbackImageByName(item.name);
                            }}
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
