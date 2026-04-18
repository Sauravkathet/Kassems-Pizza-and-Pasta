import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { buildFallbackMenuCategories } from "@shared/menu-data";
import { withApiBase } from "@/lib/queryClient";

function isMenuCategoryArray(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((category) => {
    if (!category || typeof category !== "object") {
      return false;
    }

    const maybeCategory = category as {
      id?: unknown;
      name?: unknown;
      slug?: unknown;
      sortOrder?: unknown;
      items?: unknown;
    };

    return (
      typeof maybeCategory.id === "number" &&
      typeof maybeCategory.name === "string" &&
      typeof maybeCategory.slug === "string" &&
      typeof maybeCategory.sortOrder === "number" &&
      Array.isArray(maybeCategory.items)
    );
  });
}

export function useMenu() {
  return useQuery({
    queryKey: [api.menu.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(withApiBase(api.menu.list.path));
        if (!res.ok) {
          throw new Error(`Menu request failed with ${res.status}`);
        }

        const payload = await res.json();
        if (!isMenuCategoryArray(payload)) {
          throw new Error("Menu API returned an unexpected payload");
        }

        return api.menu.list.responses[200].parse(payload);
      } catch (error) {
        console.warn("Falling back to bundled menu data.", error);
        return buildFallbackMenuCategories();
      }
    },
  });
}
