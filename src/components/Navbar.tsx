import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X, MapPin, ChevronDown, User, LogOut, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-foreground">
                book<span className="text-primary">my</span>show
              </span>
            </a>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for Movies, Events, Plays, Sports..."
                className="w-80 pl-10 bg-secondary border-0 placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Location */}
            <button className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Mumbai</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* User Menu or Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/my-bookings")} className="gap-2 cursor-pointer">
                    <Ticket className="w-4 h-4" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8 h-12">
          <a href="/" className="text-sm text-foreground font-medium border-b-2 border-primary pb-3">
            Movies
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-3">
            Stream
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-3">
            Events
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-3">
            Plays
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-3">
            Sports
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-3">
            Activities
          </a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-full pl-10 bg-secondary border-0"
              />
            </div>

            {/* Mobile Location */}
            <button className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Mumbai</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-3">
              <a href="/" className="text-foreground font-medium py-2">Movies</a>
              <a href="#" className="text-muted-foreground py-2">Stream</a>
              <a href="#" className="text-muted-foreground py-2">Events</a>
              <a href="#" className="text-muted-foreground py-2">Plays</a>
              <a href="#" className="text-muted-foreground py-2">Sports</a>
              <a href="#" className="text-muted-foreground py-2">Activities</a>
              {user && (
                <>
                  <hr className="border-border" />
                  <a href="/my-bookings" className="text-muted-foreground py-2 flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    My Bookings
                  </a>
                  <button onClick={handleSignOut} className="text-destructive py-2 flex items-center gap-2 text-left">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
