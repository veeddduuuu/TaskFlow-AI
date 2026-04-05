import { useState, useRef } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AddSubtaskInput = ({ onAdd, loading }) => {
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    try {
      await onAdd(title);
      setTitle('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className={`group flex items-center gap-3 p-3 bg-dark-bg/20 border border-dashed rounded-xl transition-all mb-4
        ${isFocused ? 'border-brand-500/50 bg-dark-card/30' : 'border-dark-border/40 hover:border-dark-border/60 hover:bg-dark-card/20'}`}
    >
      <div className="w-6 h-6 flex items-center justify-center text-gray-500">
        {loading ? <Loader2 size={16} className="animate-spin text-brand-400" /> : <Plus size={18} className="group-hover:text-brand-400 transition-colors" />}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a step to this task..."
        className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-600 focus:outline-none"
      />
      {title.trim() && (
        <button
          type="submit"
          className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-wider"
        >
          Add
        </button>
      )}
    </motion.form>
  );
};

export default AddSubtaskInput;
