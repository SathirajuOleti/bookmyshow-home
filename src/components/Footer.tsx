import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {/* Movies */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Movies Now Showing</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pushpa 2: The Rule</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kalki 2898 AD</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fighter</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dunki</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Animal</a></li>
            </ul>
          </div>

          {/* Upcoming */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Upcoming Movies</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">War 2</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pathaan 2</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Spirit</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Salaar 2</a></li>
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Events</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Live Concerts</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Comedy Shows</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Music Festivals</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Theatre Plays</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Connect With Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">B</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                book<span className="text-primary">my</span>show
              </span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center">
              © 2024 BookMyShow Clone. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
