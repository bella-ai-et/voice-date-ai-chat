
import { User } from "lucide-react";

interface AIAvatarProps {
  name: string;
  personality: string;
  avatarColor: string;
}

const AIAvatar = ({ name, personality, avatarColor }: AIAvatarProps) => (
  <div className="flex flex-col items-center gap-2 px-4">
    <div className={`rounded-full bg-gradient-to-br ${avatarColor} shadow-lg p-5`}>
      {/* Placeholder icon/avatar */}
      <User size={40} className="text-white" />
    </div>
    <div className="text-lg font-semibold text-fuchsia-800">{name}</div>
    <div className="text-sm text-fuchsia-500 italic text-center max-w-[120px]">{personality}</div>
  </div>
);

export default AIAvatar;
