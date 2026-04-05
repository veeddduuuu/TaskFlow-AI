import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Zap, FolderKanban, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/execution', label: 'Execution', icon: Zap },
  { to: '/dashboard', label: 'Dashboard', icon: FolderKanban },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left — Logo + Nav Links */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <NavLink to="/execution" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center shadow-md shadow-brand-500/20">
              <LayoutDashboard size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              TaskFlow <span className="text-brand-400">AI</span>
            </span>
          </NavLink>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-dark-card'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right — User + Logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-500">
            Hey, <span className="text-gray-300 font-medium">{user?.username || 'there'}</span> 👋
          </span>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-dark-card border border-transparent hover:border-dark-border transition-all cursor-pointer"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
