import { useMutation } from "@tanstack/react-query";
import { api, type InsertCateringInquiry } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateCateringInquiry() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCateringInquiry) => {
      // JSON dates are tricky, but Zod coerce helps on server.
      // Here we assume the server handles ISO strings from JSON.stringify correctly via Zod
      const res = await fetch(api.catering.create.path, {
        method: api.catering.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.catering.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit inquiry");
      }
      return api.catering.create.responses[201].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
