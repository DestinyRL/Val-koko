import { useMutation } from "@tanstack/react-query";
import { api, type InsertResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateResponse() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertResponse) => {
      const res = await fetch(api.response.create.path, {
        method: api.response.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error('Failed to save response');
      }
      
      return await res.json();
    },
    onError: () => {
      toast({
        title: "Oh no...",
        description: "Something went wrong saving your answer. But I still heard it!",
        variant: "destructive",
      });
    }
  });
}
