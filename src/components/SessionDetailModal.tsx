
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionLog } from "@/pages/SessionHistory";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

type Props = {
  open: boolean;
  session: SessionLog | null;
  onClose: () => void;
};

const SessionDetailModal = ({ open, session, onClose }: Props) => {
  if (!open || !session) return null;
  const transcriptLines = session.conversation_transcript.split("\n").filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center gap-2">
              <History size={22} className="text-fuchsia-500" />
              Session with {session.character_name || "Unknown"}
            </span>
          </DialogTitle>
          <DialogDescription>
            <span>
              {session.start_time.slice(0, 16).replace("T", " ")}
              {session.end_time
                ? ` &mdash; Duration: ${Math.max(
                    1,
                    (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) /
                      1000
                  )
                    .toFixed(0)
                    .toString()} sec`
                : ""}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="mb-2 font-semibold">Transcript:</div>
        <ScrollArea className="max-h-60 border rounded px-2 py-2 bg-gray-50">
          <ul className="space-y-1">
            {transcriptLines.length === 0 && (
              <li className="text-gray-400 italic">No transcript available.</li>
            )}
            {transcriptLines.map((line, idx) => (
              <li key={idx} className="text-sm">
                {line}
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="mt-4 font-semibold">AI Feedback:</div>
        <div className="text-sm text-gray-700 min-h-[32px] p-2 bg-fuchsia-50 rounded">
          {session.ai_feedback || <span className="text-gray-400">No feedback provided.</span>}
        </div>
        <Button className="mt-4" onClick={onClose} variant="secondary">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailModal;

