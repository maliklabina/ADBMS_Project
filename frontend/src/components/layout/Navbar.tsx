import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hotel, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Room', path: '/booking' },
    { name: 'Check-in/Check-out', path: '/check-status' },
    { name: 'Sign In', path: '/auth' },
  ];

  const privateLinks = [
    { name: 'Guests', path: '/guests' },
  ];

  const navLinks = [
    ...publicLinks,
    ...(isAuthenticated ? privateLinks : [{ name: 'Login', path: '/login' }]),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow group-hover:shadow-accent transition-all duration-300">
              <Hotel className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LuxStay Hotel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-t animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "hover:bg-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg font-medium hover:bg-secondary transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
