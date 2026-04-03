import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-dark-border bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-brand-500" />
          <span className="font-bold text-lg tracking-tight">TaskFlow AI</span>
        </div>

        <nav className="flex gap-6">
          <Link to="/auth/login" className="text-gray-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/auth/register" className="text-gray-400 hover:text-white transition-colors">
            Sign Up
          </Link>
          <a 
            href="https://github.com/veeddduuuu/TaskFlow-AI" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
