
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VoiceChatPanel from "@/components/VoiceChatPanel";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn fallbackRedirectUrl="/dashboard" />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center gap-8 py-12 px-4">
          <h2 className="text-2xl font-semibold text-fuchsia-700 mb-4">
            Welcome to your Dashboard!
          </h2>
          <Button
            className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow transition hover:bg-fuchsia-700"
            onClick={() => navigate("/speed-date")}
          >
            Start New Speed Date
          </Button>
        </div>
      </SignedIn>
    </>
  );
};

export default Dashboard;
