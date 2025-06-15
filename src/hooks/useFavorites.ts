
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Local fallback type since supabase/types.ts does NOT include "favorites"
export type Favorite = {
  id: string;
  character_id: string;
  user_id: string;
  created_at: string;
};

export function useFavorites(userId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch favorites for userId
  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async (): Promise<Favorite[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("favorites" as any)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      // Defensive check: only return data if it's an array, else []
      if (Array.isArray(data)) {
        // TS fix: cast through unknown first
        return data as unknown as Favorite[];
      }
      return [];
    },
    enabled: !!userId,
  });

  // Add favorite
  const addFavorite = useMutation({
    mutationFn: async (characterId: string) => {
      if (!userId) throw new Error("Not logged in");
      const { error } = await supabase
        .from("favorites" as any)
        .insert([{ user_id: userId, character_id: characterId }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  // Remove favorite
  const removeFavorite = useMutation({
    mutationFn: async (characterId: string) => {
      if (!userId) throw new Error("Not logged in");
      const { error } = await supabase
        .from("favorites" as any)
        .delete()
        .eq("user_id", userId)
        .eq("character_id", characterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  return {
    favorites: data,
    isLoading,
    error,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    isAdding: addFavorite.isPending,
    isRemoving: removeFavorite.isPending,
  };
}
