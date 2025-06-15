
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import VoiceChatPanel from "@/components/VoiceChatPanel";

const SpeedDate = () => {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn signInFallbackRedirectUrl="/speed-date" />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 via-fuchsia-100 to-purple-50">
          <main className="flex-grow flex flex-col items-center justify-center">
            <VoiceChatPanel />
          </main>
        </div>
      </SignedIn>
    </>
  );
};

export default SpeedDate;

