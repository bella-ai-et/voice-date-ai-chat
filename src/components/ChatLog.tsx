
interface Message {
  id: number;
  from: "user" | "ai";
  text: string;
}

interface ChatLogProps {
  messages: Message[];
}

const ChatLog = ({ messages }: ChatLogProps) => {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[320px] px-1">
      {messages.map((msg) =>
        msg.from === "ai" ? (
          <div
            key={msg.id}
            className="self-start bg-pink-100 text-fuchsia-800 px-4 py-2 rounded-2xl rounded-bl-none max-w-[70%] shadow animate-fade-in"
          >
            {msg.text}
          </div>
        ) : (
          <div
            key={msg.id}
            className="self-end bg-fuchsia-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[70%] shadow animate-fade-in"
          >
            {msg.text}
          </div>
        )
      )}
    </div>
  );
};

export default ChatLog;
