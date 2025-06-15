
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type AICharacter = {
  id: string;
  name: string;
  personality: string;
  avatar_url: string | null;
  avatar_color: string | null;
};

export const useAICharacters = () => {
  return useQuery({
    queryKey: ["ai-characters"],
    queryFn: async (): Promise<AICharacter[]> => {
      const { data, error } = await supabase
        .from("ai_characters")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
};
