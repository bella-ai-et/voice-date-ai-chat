
import Header from "@/components/Header";
import VoiceChatPanel from "@/components/VoiceChatPanel";

const Index = () => (
  <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-pink-100 via-fuchsia-100 to-purple-50">
    <Header />
    <main className="flex-grow flex flex-col items-center justify-center">
      <VoiceChatPanel />
    </main>
    <footer className="pb-8 pt-12 text-center text-xs text-gray-400 opacity-70">
      Prototype – AI Speed Dating Practice · <span className="font-semibold">Lovable</span> + shadcn/ui + Tailwind
    </footer>
  </div>
);

export default Index;
