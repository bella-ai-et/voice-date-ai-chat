
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SaveConversationArgs = {
  user_id: string;
  character_id: string;
  start_time: string;
  end_time: string;
  conversation_transcript: string;
  ai_feedback?: string;
};

export function useSaveConversationLog() {
  return useMutation({
    mutationFn: async ({
      user_id,
      character_id,
      start_time,
      end_time,
      conversation_transcript,
      ai_feedback,
    }: SaveConversationArgs) => {
      const { data, error } = await supabase
        .from("conversation_logs")
        .insert([
          {
            user_id,
            character_id,
            start_time,
            end_time,
            conversation_transcript,
            ai_feedback,
          },
        ]);
      if (error) throw error;
      return data;
    },
  });
}
