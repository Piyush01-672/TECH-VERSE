import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import techverseLogo from "@/assets/techverse-logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About us", path: "/about" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "Contact", path: "/contact" },
    { name: "CodeCrafter 3.0", path: "/codecrafter" },

  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!isOpen || window.innerWidth >= 1024) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && toggleBtnRef.current && !toggleBtnRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      // document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-2 relative">
            <Link to="/" className="flex items-center gap-2 group relative">
              <img
                src={techverseLogo}
                alt="Techverse Club"
                className="h-12 w-12 rounded-full object-cover transition-transform group-hover:scale-110"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  TechVerse
                </h1>
              </div>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/register">
              <Button
                variant="default"
                className="bg-gradient-to-br from-[#252D6F] to-[#4676E6] shadow-lg 
               transition-transform transform hover:scale-105 
               hover:from-blue-500 hover:to-blue-700
               active:scale-95 active:from-blue-600 active:to-blue-800"
              >
                Register Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className="lg:hidden py-4 space-y-2 animate-fade-in"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-[#252D6F] to-[#4676E6] 
               hover:from-blue-500 hover:to-blue-700"
                >
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
