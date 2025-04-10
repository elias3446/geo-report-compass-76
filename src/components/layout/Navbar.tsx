
import { Link, useLocation } from "react-router-dom";
import { Bell, Map, BarChart3, FileText, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
    { name: "Map", path: "/map", icon: <Map className="h-5 w-5 mr-2" /> },
    { name: "Reports", path: "/reports", icon: <FileText className="h-5 w-5 mr-2" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">GeoReport</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Link to="/new-report">
              <Button className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                New Report
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Link
              to="/new-report"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Report
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
