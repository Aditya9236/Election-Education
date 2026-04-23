import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import useProgressStore from '../store/useProgressStore';
import { CheckCircle, XCircle, ArrowRight, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function QuizDashboard() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const setQuizScore = useProgressStore(state => state.setQuizScore);
  const checkBadge = useProgressStore(state => state.checkBadge);

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (showResults) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF9933', '#FFFFFF', '#138808'] // Tricolor
      });
    }
  }, [showResults]);

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentIdx].correctOptionIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      const finalScore = score + (selectedOption === questions[currentIdx].correctOptionIndex ? 1 : 0);
      setQuizScore(finalScore, questions.length);
      setTimeout(() => {
        checkBadge();
      }, 500);
    }
  };

  if (questions.length === 0) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent"></div>
    </div>
  );

  const currentQ = questions[currentIdx];

  const chartData = [
    { name: 'Your Score', score: showResults ? score : 0 },
    { name: 'Avg Learner', score: Math.round(questions.length * 0.7) }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-8 min-h-screen"
    >
      <h2 className="text-5xl font-extrabold text-primary mb-10 text-center">Knowledge Check</h2>
      
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div 
            key={`question-${currentIdx}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t-4 border-accent"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="text-sm font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-5 py-2.5 rounded-full shadow-inner border border-accent/20">
                Question {currentIdx + 1} of {questions.length}
              </div>
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <div key={i} className={`h-2.5 w-10 rounded-full transition-colors shadow-inner ${i === currentIdx ? 'bg-accent' : i < currentIdx ? 'bg-emerald-500' : 'bg-primary/20'}`}></div>
                ))}
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary mb-10 leading-tight">{currentQ.question}</h3>
            
            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 font-bold text-lg ";
                let contentClass = "flex items-center justify-between text-primary";
                
                if (!isAnswered) {
                  btnClass += selectedOption === idx ? "border-accent bg-accent/10 shadow-md" : "border-[var(--color-glass-border)] bg-[var(--color-secondary)]/50 hover:border-accent hover:shadow-lg hover:-translate-y-1";
                } else {
                  if (idx === currentQ.correctOptionIndex) {
                    btnClass += "border-emerald-500 bg-emerald-500/10 shadow-lg scale-[1.02] text-emerald-700 dark:text-emerald-300";
                    contentClass = "flex items-center justify-between text-emerald-700 dark:text-emerald-300";
                  } else if (idx === selectedOption) {
                    btnClass += "border-red-500 bg-red-500/10 opacity-60 text-red-700 dark:text-red-400";
                    contentClass = "flex items-center justify-between text-red-700 dark:text-red-400";
                  } else {
                    btnClass += "border-[var(--color-glass-border)] opacity-40 bg-[var(--color-secondary)]/30";
                  }
                }

                return (
                  <motion.button 
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    key={idx} 
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    <div className={contentClass}>
                      <span>{opt}</span>
                      {isAnswered && idx === currentQ.correctOptionIndex && <CheckCircle className="text-emerald-500 w-8 h-8" />}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctOptionIndex && <XCircle className="text-red-500 w-8 h-8" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                  className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-xl text-primary overflow-hidden shadow-inner"
                >
                  <strong className="block mb-2 font-bold text-xl text-accent">Explanation</strong> 
                  <span className="leading-relaxed text-lg font-medium">{currentQ.explanation}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 flex justify-end"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="bg-emerald-600 text-white px-10 py-4 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-3 font-bold text-lg shadow-[0_10px_20px_rgba(19,136,8,0.3)]"
                  >
                    {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={24} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t-4 border-emerald-500 flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold px-6 py-2 rounded-full mb-6 uppercase tracking-widest text-sm border border-emerald-500/20">
                Quiz Complete
              </div>
              <h3 className="text-5xl font-extrabold mb-6 text-primary">Your Results</h3>
              <div className="text-2xl mb-8 font-medium">
                You scored <span className="text-emerald-600 dark:text-emerald-400 text-7xl font-black mx-2 drop-shadow-md">{score}</span> out of {questions.length}
              </div>
              <p className="text-primary/80 leading-relaxed text-lg mb-8 font-medium">
                Great job reinforcing your knowledge of the democratic election process! If you've completed all modules, you will be awarded the Civic Scholar badge.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCertificate(true)}
                className="bg-gradient-to-r from-accent to-emerald-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:shadow-[0_10px_30px_rgba(255,153,51,0.4)] transition-all w-full sm:w-auto justify-center"
              >
                <Award size={24} /> View Your Certificate
              </motion.button>
            </div>
            
            <div className="flex-1 w-full h-[400px] bg-[var(--color-secondary)]/50 p-6 rounded-2xl shadow-inner border border-[var(--color-glass-border)]">
              <h4 className="text-center font-bold mb-6 text-primary tracking-wide text-xl">Performance Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-glass-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-main)', fontWeight: 800, fontSize: 16 }} dy={10} />
                  <YAxis domain={[0, questions.length]} allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-main)', opacity: 0.6, fontWeight: 600 }} dx={-10} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-text-main)', opacity: 0.05 }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-glass-border)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', fontSize: '16px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-main)' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={80}>
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#138808' : '#FF9933'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-2 relative shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-accent"
            >
              <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setShowCertificate(false)} className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="border-[12px] border-double border-emerald-500 p-12 text-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-900 dark:to-slate-800">
                <div className="absolute top-0 left-0 w-48 h-48 bg-accent/20 rounded-br-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-tl-full blur-2xl"></div>
                
                <Award className="w-24 h-24 text-accent mx-auto mb-6 drop-shadow-md" />
                <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-widest mb-4" style={{ fontFamily: 'Georgia, serif' }}>Certificate of Achievement</h1>
                <p className="text-xl text-primary/70 font-medium mb-8">This proudly certifies that</p>
                <h2 className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 border-b-2 border-primary/20 pb-4 mb-8 inline-block px-12">
                  Civic Scholar
                </h2>
                <p className="text-lg text-primary max-w-2xl mx-auto leading-relaxed font-medium">
                  Has successfully completed the Election Simulator and demonstrated an outstanding understanding of the democratic process, including voter registration, secret ballots, and secure vote counting.
                </p>
                
                <div className="mt-16 flex justify-between items-end px-4 md:px-12">
                  <div className="border-t-2 border-primary/50 w-48 pt-2 text-left">
                    <span className="text-primary/60 font-bold block uppercase text-sm tracking-wider">Date</span>
                    <span className="text-primary font-bold text-lg">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="w-32 h-32 border-8 border-accent/80 rounded-full flex items-center justify-center rotate-12 bg-accent/10 relative shadow-inner">
                    <div className="absolute inset-2 border-2 border-dashed border-accent/50 rounded-full"></div>
                    <span className="font-black text-accent text-sm uppercase text-center leading-tight tracking-widest">Official<br/>Seal</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
