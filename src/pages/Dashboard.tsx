import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VoiceChatPanel from "@/components/VoiceChatPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";
import { useAICharacters } from "@/hooks/useAICharacters";
import { useFavorites } from "@/hooks/useFavorites";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: aiCharacters, isLoading } = useAICharacters();
  const { favorites } = useFavorites(user?.id);

  // Find favorited character objects
  const favoritedCharacterIds = (favorites || []).map((f) => f.character_id);
  const favoredCharacters =
    aiCharacters?.filter((c) => favoritedCharacterIds.includes(c.id)) || [];

  return (
    <>
      <SignedOut>
        <RedirectToSignIn signInFallbackRedirectUrl="/dashboard" />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center gap-8 py-12 px-4">
          <h2 className="text-2xl font-semibold text-fuchsia-700 mb-4">
            Welcome to your Dashboard!
          </h2>
          <div className="flex gap-4">
            <Button
              className="bg-fuchsia-500 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow transition hover:bg-fuchsia-700"
              onClick={() => navigate("/speed-date")}
            >
              Start New Speed Date
            </Button>
            <Button
              className="bg-fuchsia-100 text-fuchsia-700 font-semibold px-6 py-2 rounded-lg shadow border hover:bg-fuchsia-200 transition"
              onClick={() => navigate("/session-history")}
              variant="outline"
            >
              Session History
            </Button>
          </div>
          <Tabs defaultValue="all" className="w-full md:w-[700px] mt-8">
            <TabsList>
              <TabsTrigger value="all">All Characters</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {aiCharacters &&
                  aiCharacters.map((ai) => (
                    <div
                      key={ai.id}
                      className="flex flex-col items-center bg-white rounded-xl shadow border p-4 gap-2"
                    >
                      <div className="font-semibold text-fuchsia-700">{ai.name}</div>
                      <div className="text-sm text-gray-500 italic">{ai.personality}</div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="favorites">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {favoredCharacters.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 mt-4">No favorites yet.</div>
                )}
                {favoredCharacters.map((ai) => (
                  <div
                    key={ai.id}
                    className="flex flex-col items-center bg-amber-50 rounded-xl shadow border p-4 gap-2"
                  >
                    <div className="font-semibold text-fuchsia-700">{ai.name}</div>
                    <div className="text-sm text-gray-600 italic">{ai.personality}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SignedIn>
    </>
  );
};

export default Dashboard;
