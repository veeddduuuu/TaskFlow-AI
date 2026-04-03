import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Layers className="h-8 w-8 text-brand-500" />
            <span className="font-bold text-xl tracking-tight">TaskFlow AI</span>
          </div>
          
          {/* Right Links */}
          <div className="flex items-center gap-4">
            <Link 
              to="/auth/login" 
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/auth/register" 
              className="px-4 py-2 bg-primary-gradient text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-brand-500/25 transition-all"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
