import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Text Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Stop managing tasks.<br />
          <span className="text-gradient">Start executing them.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          TaskFlow AI tells you exactly what to work on every day based on deadlines, priorities, and team dependencies.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/auth/register" 
            className="px-8 py-4 bg-primary-gradient text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-brand-500/25 transition-all w-full sm:w-auto"
          >
            Get Started
          </Link>
          <a 
            href="#how-it-works" 
            className="px-8 py-4 bg-dark-border text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            See how it works
          </a>
        </div>
      </motion.div>

      {/* Mock Daily Execution View */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-20 w-full max-w-4xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-purple-brand-500"></div>
        <div className="flex items-center justify-between mb-8 border-b border-dark-border pb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="text-brand-400 h-6 w-6" /> Your Daily Plan
            </h2>
            <p className="text-gray-400 text-sm mt-1">AI-Recommended tasks for today</p>
          </div>
          <div className="bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full text-sm font-medium border border-brand-500/20">
            3 Tasks Remaining
          </div>
        </div>

        <div className="space-y-4">
          <MockTask 
            title="Finish Landing Page PRD" 
            project="TaskFlow UI" 
            urgency="High (Due Today)"
            icon={<AlertCircle className="text-red-400 h-5 w-5" />}
            borderClass="border-red-500/50"
            delay={0.4}
          />
          <MockTask 
            title="Setup Authentication API" 
            project="Backend Core" 
            urgency="Medium (Unblocked)"
            icon={<Circle className="text-yellow-400 h-5 w-5" />}
            borderClass="border-yellow-500/50"
            delay={0.5}
          />
          <MockTask 
            title="Review Database Schema" 
            project="Database" 
            urgency="Low (No dependencies)"
            icon={<CheckCircle2 className="text-green-400 h-5 w-5 opacity-50" />}
            borderClass="border-dark-border"
            delay={0.6}
            completed
          />
        </div>
      </motion.div>
    </section>
  );
}

function MockTask({ title, project, urgency, icon, borderClass, delay, completed = false }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`flex items-center justify-between p-4 bg-[#1a2336] rounded-xl border-l-4 ${borderClass} hover:bg-[#1f293f] transition-colors cursor-pointer group`}
    >
      <div className="flex items-center gap-4">
        <div className="mt-1 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <div className={completed ? 'opacity-50 line-through' : ''}>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{project} • <span className="text-gray-500">{urgency}</span></p>
        </div>
      </div>
      {!completed && (
        <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-brand-600 rounded-lg text-sm font-medium hover:bg-brand-500 transition-all">
          Start Work
        </button>
      )}
    </motion.div>
  );
}
