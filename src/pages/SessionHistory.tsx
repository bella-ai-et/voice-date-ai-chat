
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import SessionHistoryList from "@/components/SessionHistoryList";
import SessionDetailModal from "@/components/SessionDetailModal";
import { Button } from "@/components/ui/button";

export type SessionLog = {
  id: string;
  character_id: string;
  start_time: string;
  end_time: string | null;
  conversation_transcript: string;
  ai_feedback: string | null;
  created_at: string;
  character_name?: string; // loaded with join
};

const fetchSessions = async (userId?: string): Promise<SessionLog[]> => {
  if (!userId) return [];
  // Fetch logs, plus character name by join
  const { data, error } = await supabase
    .from("conversation_logs")
    .select(
      "id, character_id, start_time, end_time, conversation_transcript, ai_feedback, created_at, ai_characters(name)"
    )
    .eq("user_id", userId)
    .order("start_time", { ascending: false });
  if (error) throw error;
  // Map so character name is top-level
  return (
    data?.map((row: any) => ({
      ...row,
      character_name: row.ai_characters?.name || "",
    })) ?? []
  );
};

const SessionHistory = () => {
  const { user } = useUser();
  const [selectedSession, setSelectedSession] = useState<SessionLog | null>(null);

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ["session-history", user?.id],
    queryFn: () => fetchSessions(user?.id),
    enabled: !!user?.id,
  });

  return (
    <div className="flex flex-col items-center py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-fuchsia-700 mb-6">
        Session History
      </h2>
      {isLoading && <div>Loading sessions...</div>}
      {error && (
        <div className="text-red-500">Error loading sessions. Try again.</div>
      )}
      {!isLoading && sessions && (
        <SessionHistoryList sessions={sessions} onSelect={setSelectedSession} />
      )}
      <SessionDetailModal
        open={!!selectedSession}
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
      <Button
        className="mt-8"
        variant="secondary"
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </div>
  );
};

export default SessionHistory;

