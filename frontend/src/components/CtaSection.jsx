import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CtaSection() {
  return (
    <section className="py-24 px-4 border-y border-dark-border/50 bg-gradient-to-b from-transparent to-brand-900/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Still guessing what to work on?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Let TaskFlow AI decide for you. Stop planning the work, and just do the work.
          </p>
          <Link 
            to="/auth/register" 
            className="inline-block px-10 py-5 bg-primary-gradient text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-brand-500/30 hover:-translate-y-1 transition-all"
          >
            Get Started for Free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
