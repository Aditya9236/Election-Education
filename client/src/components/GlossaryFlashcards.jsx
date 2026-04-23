import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';

export default function GlossaryFlashcards() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/glossary')
      .then(res => {
        setTerms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto py-8 min-h-screen px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-primary mb-4 flex justify-center items-center gap-4">
          <BookOpen className="w-12 h-12 text-accent" />
          Interactive Glossary
        </h2>
        <p className="text-primary/80 text-xl font-medium max-w-2xl mx-auto">
          Click on any card to flip it and reveal the definition of key democratic terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {terms.map((term, index) => (
          <Flashcard key={term._id || index} term={term} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

function Flashcard({ term, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="h-64 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 w-full h-full glass rounded-3xl p-8 flex flex-col items-center justify-center border-t-4 border-accent shadow-[0_10px_30px_rgba(255,153,51,0.1)] hover:shadow-[0_15px_40px_rgba(255,153,51,0.2)] transition-shadow"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-accent opacity-50" />
          </div>
          <h3 className="text-3xl font-black text-primary text-center break-words">{term.term}</h3>
          <p className="text-primary/40 text-sm font-bold mt-4 uppercase tracking-widest">Click to Flip</p>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full glass rounded-3xl p-8 flex flex-col items-center justify-center border-b-4 border-emerald-500 shadow-[0_10px_30px_rgba(19,136,8,0.1)] overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-emerald-500/20 pb-2 w-full text-center">
            Definition
          </h4>
          <p className="text-primary/90 text-lg text-center font-medium leading-relaxed">
            {term.definition}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
