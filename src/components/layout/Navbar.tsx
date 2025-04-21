
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Map, BarChart3, FileText, PlusCircle, Menu, X, User, Settings, LogOut, HelpCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
    { name: "Map", path: "/map", icon: <Map className="h-5 w-5 mr-2" /> },
    { name: "Reports", path: "/reports", icon: <FileText className="h-5 w-5 mr-2" /> },
    {
      name: "Admin",
      path: "/admin",
      icon: <Settings className="h-5 w-5 mr-2" />,
      disabled: role !== "admin",
    },
    { name: "Help", path: "/help", icon: <HelpCircle className="h-5 w-5 mr-2" /> },
  ];

  const filteredNavItems = navItems.map(item =>
    item.name === "Admin"
      ? { ...item, disabled: role !== "admin" }
      : item
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Globe className="h-6 w-6 text-primary mr-2" />
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
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : item.disabled
                      ? "text-muted-foreground/60 pointer-events-none cursor-not-allowed"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled}
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

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" variant="destructive">3</Badge>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{user ? user[0].toUpperCase() : "JD"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user ? user : "Invitado"}</p>
                    <p className="text-xs text-muted-foreground">{role ? (role === "admin" ? "Administrador" : "Usuario") : null}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : item.disabled
                      ? "text-muted-foreground/60 pointer-events-none cursor-not-allowed"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled}
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
            
            <div className="flex items-center justify-between px-3 py-2 mt-4 border-t border-border">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{user ? user[0].toUpperCase() : "JD"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user ? user : "Invitado"}</p>
                  <p className="text-xs text-muted-foreground">{role ? (role === "admin" ? "Administrador" : "Usuario") : null}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" variant="destructive">3</Badge>
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center mt-2"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
