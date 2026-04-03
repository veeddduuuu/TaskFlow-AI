import { motion } from 'framer-motion';
import { Zap, Users, ShieldAlert, ListTodo } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-brand-400" />,
      title: "Daily Execution Engine",
      description: "Smart daily task recommendations. Focus on what actually matters without getting overwhelmed by the backlog."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Team Awareness",
      description: "Know instantly what's blocked, why it's blocked, and who is working on what."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-yellow-400" />,
      title: "Smart Prioritization",
      description: "Automatically ranks tasks based on deadlines, overall importance, and cross-team dependencies."
    },
    {
      icon: <ListTodo className="h-6 w-6 text-green-400" />,
      title: "Task Management",
      description: "Clean, simple execution tracking. No bloated features—just check off your daily goals."
    }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Core Principles</h2>
        <p className="text-gray-400 text-lg">We stripped away the noise so you can get to work.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={index}
            className="flex gap-4 p-6 bg-dark-card border border-dark-border rounded-xl hover:border-brand-500/20 hover:bg-[#151e2e] transition-all"
          >
            <div className="flex-shrink-0 mt-1 bg-[#1a2336] p-3 rounded-lg border border-dark-border">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
