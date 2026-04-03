import { motion } from 'framer-motion';
import { PenTool, Cpu, Target } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <PenTool className="h-8 w-8 text-brand-400" />,
      title: "1. Create your project",
      description: "Add tasks, deadlines, and team members with our frictionless UI."
    },
    {
      icon: <Cpu className="h-8 w-8 text-purple-400" />,
      title: "2. We analyze everything",
      description: "Our engine crunches priorities, deadlines, and team dependencies instantly."
    },
    {
      icon: <Target className="h-8 w-8 text-green-400" />,
      title: "3. Get your daily plan",
      description: "Wake up, open TaskFlow AI, and know exactly what to do today."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-dark-bg/50 border-y border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stop overcomplicating your workflow. We keep it to three brutal steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              key={index}
              className="bg-dark-card border border-dark-border p-8 rounded-2xl hover:border-brand-500/30 transition-colors"
            >
              <div className="w-16 h-16 bg-[#1a2336] rounded-2xl flex items-center justify-center mb-6 shadow-md border border-dark-border">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
