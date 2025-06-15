
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => (
  <header className="w-full flex items-center justify-between py-5 px-8 bg-gradient-to-r from-pink-100/60 via-purple-100 to-fuchsia-50 shadow rounded-b-lg mb-4">
    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent animate-fade-in">
      AI Speed Dating Lounge
    </h1>
    {/* Sign in button placeholder (real auth later) */}
    <Button className="flex gap-2 items-center rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 shadow-lg transition">
      <User size={20} /> Sign In
    </Button>
  </header>
);

export default Header;
