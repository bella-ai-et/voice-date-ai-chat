import React, { useState, useRef } from "react";
import { Mic, MicOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIAvatar from "./AIAvatar";
import ChatLog from "./ChatLog";
import { toast } from "@/hooks/use-toast";
import { useAICharacters } from "@/hooks/useAICharacters";
import { useSaveConversationLog } from "@/hooks/useSaveConversationLog";
import { useUser } from "@clerk/clerk-react";

// Define Message type
type Message = {
  id: number;
  from: "user" | "ai";
  text: string;
};

const SAMPLE_GREETING = [
  "Hi there! What brings you to this speed dating event?",
  "Hey! Looking for some fun conversation?",
  "Hello! What's the most exciting thing you've done recently?",
];

const VoiceChatPanel = () => {
  const { data: aiCharacters, isLoading, error } = useAICharacters();
  const [currentAI, setCurrentAI] = useState(0);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "ai",
      text: SAMPLE_GREETING[Math.floor(Math.random() * SAMPLE_GREETING.length)],
    },
  ]);
  const [msgId, setMsgId] = useState(1);

  // Conversation logging
  const { user } = useUser();
  const startTimeRef = useRef<string>(new Date().toISOString());
  const { mutate: saveConversationLog } = useSaveConversationLog();

  if (isLoading) {
    return <div className="py-20 text-center">Loading AI characters...</div>;
  }

  if (error) {
    return (
      <div className="py-20 text-red-500 text-center">
        Failed to load AI characters. Please try again.
      </div>
    );
  }

  if (!aiCharacters || aiCharacters.length === 0) {
    return (
      <div className="py-20 text-center text-fuchsia-700">
        No AI characters found. Please add them in the database.
      </div>
    );
  }

  const ai = aiCharacters[currentAI];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { id: msgId, from: "user", text: input },
    ]);
    setMsgId((id) => id + 1);

    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgId + 1,
          from: "ai",
          text: `(${ai.name}) That's interesting! Tell me more.`,
        },
      ]);
      setMsgId((id) => id + 2);
    }, 1100);
    setInput("");
  };

  const handleVoiceInput = () => {
    setListening((l) => !l);
    if (!listening) {
      toast({
        title: "🎤 Voice record (simulated)",
        description:
          "Pretend you are speaking – (real voice support coming soon!)",
      });
    }
  };

  // --- NEW: Generate & show AI feedback after each session ---
  const generateAIFeedback = async ({
    transcript,
    aiName,
    aiPersonality,
  }: {
    transcript: string;
    aiName: string;
    aiPersonality: string;
  }): Promise<string | null> => {
    try {
      const res = await fetch(
        "https://xqnlnqqoobwybgcusqly.functions.supabase.co/feedback-ai-character",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript, aiName, aiPersonality }),
        }
      );
      const data = await res.json();
      return data.feedback || null;
    } catch (e) {
      console.error("Failed to fetch AI feedback:", e);
      return null;
    }
  };

  const handleNextAI = async () => {
    // Store conversation transcript before switching, if user is logged in
    if (user && user.id && ai && messages.length > 1) {
      const transcript = messages
        .map(({ from, text }) => `${from}: ${text}`)
        .join("\n");
      const now = new Date().toISOString();

      // 1. Generate AI feedback and show to user
      const feedback = await generateAIFeedback({
        transcript,
        aiName: ai.name,
        aiPersonality: ai.personality,
      });
      if (feedback) {
        toast({
          title: "AI Feedback",
          description: feedback,
          variant: "default",
        });
      }

      // 2. Save log + feedback to Supabase
      saveConversationLog({
        user_id: user.id,
        character_id: ai.id,
        start_time: startTimeRef.current,
        end_time: now,
        conversation_transcript: transcript,
        ai_feedback: feedback || "",
      });

      startTimeRef.current = now;
    } else {
      startTimeRef.current = new Date().toISOString();
    }

    setCurrentAI((idx) => (idx + 1) % aiCharacters.length);
    setMessages([
      {
        id: 0,
        from: "ai",
        text: SAMPLE_GREETING[Math.floor(Math.random() * SAMPLE_GREETING.length)],
      },
    ]);
    setMsgId(1);
    toast({
      title: "Switched date!",
      description: `Now talking with ${
        aiCharacters[(currentAI + 1) % aiCharacters.length].name
      }`,
    });
  };

  return (
    <div
      className="w-full grid grid-cols-12 gap-8 p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg animate-fade-in"
      style={{ minHeight: 440 }}
    >
      <div className="col-span-3 flex flex-col items-center justify-center gap-6 border-r">
        <div className="rounded-full bg-gradient-to-tr from-gray-400 to-slate-200 shadow-md p-5">
          <span className="text-2xl font-semibold text-gray-700 select-none">
            You
          </span>
        </div>
        <div className="flex flex-col items-center text-sm text-gray-400 opacity-80 animate-fade-in">
          <MicOff size={30} className="text-gray-300" />
          <span>Mic input (simulated)</span>
        </div>
      </div>
      <div className="col-span-6 flex flex-col justify-between gap-4">
        <div className="flex-1">
          <ChatLog messages={messages} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3 items-center mt-3"
        >
          <Button
            type="button"
            variant={listening ? "destructive" : "secondary"}
            size="icon"
            onClick={handleVoiceInput}
          >
            {listening ? <MicOff /> : <Mic />}
          </Button>
          <input
            className="flex-1 border rounded-lg px-3 py-2 outline-none shadow-sm focus:ring focus:ring-fuchsia-300 text-lg transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type or use your mic...`}
            autoFocus
            maxLength={140}
          />
          <Button
            type="submit"
            className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-semibold transition"
          >
            Send
          </Button>
        </form>
      </div>
      <div className="col-span-3 flex flex-col items-center justify-center gap-4 border-l">
        <AIAvatar
          name={ai.name}
          personality={ai.personality}
          avatarColor={ai.avatar_color || "from-fuchsia-500 to-rose-400"}
        />
        <Button
          onClick={handleNextAI}
          className="bg-pink-400 hover:bg-pink-500 text-white flex gap-2 items-center transition"
        >
          Next <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default VoiceChatPanel;
