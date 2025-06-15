
import { SessionLog } from "@/pages/SessionHistory";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { format, parseISO, differenceInSeconds } from "date-fns";

type Props = {
  sessions: SessionLog[];
  onSelect: (session: SessionLog) => void;
};

function getSnippet(transcript: string, maxLen = 64) {
  if (!transcript) return "";
  const text = transcript.replace(/\n/g, " ");
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

function getDuration(start: string, end?: string | null) {
  if (!end) return "";
  const sec = Math.max(1, differenceInSeconds(parseISO(end), parseISO(start)));
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${min}m ${s}s`;
}

const SessionHistoryList = ({ sessions, onSelect }: Props) => {
  if (!sessions || sessions.length === 0) {
    return <div className="text-gray-400 mt-8">No session history found.</div>;
  }
  return (
    <Table className="bg-white rounded-xl shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Character</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Snippet</TableHead>
          <TableHead>Review</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((s) => (
          <TableRow key={s.id} className="hover:bg-fuchsia-50 cursor-pointer transition">
            <TableCell>{s.character_name || <span className="text-gray-400 italic">Unknown</span>}</TableCell>
            <TableCell>{format(parseISO(s.start_time), "yyyy-MM-dd HH:mm")}</TableCell>
            <TableCell>
              <span className="flex items-center gap-1">
                <Clock size={16} /> {getDuration(s.start_time, s.end_time)}
              </span>
            </TableCell>
            <TableCell>{getSnippet(s.conversation_transcript)}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline" onClick={() => onSelect(s)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SessionHistoryList;
