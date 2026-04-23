import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import useProgressStore from './store/useProgressStore';
import { useEffect, useState } from 'react';
import TimelineGame from './components/TimelineGame';
import VotingBoothSimulator from './components/VotingBoothSimulator';
import QuizDashboard from './components/QuizDashboard';
import GlossaryFlashcards from './components/GlossaryFlashcards';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, BookOpen, UserCheck, ShieldCheck, Moon, Sun } from 'lucide-react';
import Lenis from 'lenis';

// Socket connection
const socket = io('http://localhost:5000');

function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center min-h-[150vh] w-full"
    >
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-20 dark:opacity-10 -z-10"
      >
        <source src="/election-video.mp4" type="video/mp4" />
      </video>

      <div className="relative w-full max-w-6xl mx-auto min-h-[60vh] mb-24 flex flex-col items-center justify-center mt-8">
        <div className="relative z-10 glass p-10 md:p-16 rounded-3xl max-w-3xl text-center border border-[var(--color-glass-border)] shadow-2xl m-4">
          <h1 className="text-6xl font-extrabold text-primary mb-6 tracking-tight leading-tight">
            Celebrate <span className="text-accent">Democracy</span>
          </h1>
          <p className="text-2xl text-primary max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Experience the structural mechanics of elections through interactive, smooth, and objective simulations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/timeline" className="bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_10px_30px_rgba(255,153,51,0.4)] hover:-translate-y-1 transition-all duration-300">
              Start Timeline Minigame
            </Link>
            <Link to="/simulator" className="glass border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              Mock Voting Booth
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full grid md:grid-cols-3 gap-8 mb-32 px-4">
        <motion.div whileHover={{ y: -10 }} className="glass rounded-2xl shadow-xl border-t-4 border-accent text-center overflow-hidden flex flex-col">
          <img src="/timeline.png" alt="Timeline" className="w-full h-48 object-cover border-b border-gray-200/20" />
          <div className="p-8 flex-1">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <BookOpen className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Learn the Phases</h3>
            <p className="text-primary/80 leading-relaxed font-medium">Understand the chronology of an election from registration to results declaration through an interactive drag-and-drop game.</p>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -10 }} className="glass rounded-2xl shadow-xl border-t-4 border-primary text-center overflow-hidden flex flex-col">
          <img src="/voting.png" alt="Voting Simulator" className="w-full h-48 object-cover border-b border-gray-200/20" />
          <div className="p-8 flex-1">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Secure Voting</h3>
            <p className="text-primary/80 leading-relaxed font-medium">Experience a highly animated, step-by-step voting booth simulator to see how ballots are securely cast.</p>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="glass rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center overflow-hidden flex flex-col">
          <img src="/quiz.png" alt="Quiz Dashboard" className="w-full h-48 object-cover border-b border-gray-200/20" />
          <div className="p-8 flex-1">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <UserCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Test Knowledge</h3>
            <p className="text-primary/80 leading-relaxed font-medium">Complete the modules and take a knowledge check quiz to earn your Civic Scholar badge.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<TimelineGame />} />
        <Route path="/simulator" element={<VotingBoothSimulator />} />
        <Route path="/glossary" element={<GlossaryFlashcards />} />
        <Route path="/quiz" element={<QuizDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function Layout({ children }) {
  const { badgeAwarded } = useProgressStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system preference or localStorage if needed
    const root = window.document.body;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);
  
  return (
    <div className="min-h-screen flex flex-col relative text-primary">
      <header className="glass sticky top-0 z-50 py-4 border-b border-[var(--color-glass-border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <Link to="/" className="text-3xl font-black tracking-tighter text-primary flex items-center gap-2">
            Election<span className="text-accent">Edu</span>
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex gap-8 font-bold text-sm md:text-base">
              <Link to="/timeline" className="text-primary hover:text-accent transition-colors">Timeline</Link>
              <Link to="/simulator" className="text-primary hover:text-accent transition-colors">Simulator</Link>
              <Link to="/glossary" className="text-primary hover:text-accent transition-colors">Glossary</Link>
              <Link to="/quiz" className="text-primary hover:text-accent transition-colors">Quiz</Link>
            </nav>
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 relative">
        <AnimatePresence>
          {badgeAwarded && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass border-2 border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 px-8 py-5 rounded-2xl mb-8 flex items-center shadow-[0_10px_30px_rgba(19,136,8,0.2)]"
            >
              <span className="text-3xl mr-4">🎖️</span>
              <div>
                <strong className="font-extrabold text-xl block mb-1">Congratulations! </strong>
                <span className="font-medium">You've earned the highly coveted "Civic Scholar" badge!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </main>

      <Assistant />
    </div>
  );
}

function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on('assistant_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('assistant_message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, type: 'user' }]);
    socket.emit('user_message', input);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass rounded-3xl shadow-2xl w-80 sm:w-96 h-[32rem] flex flex-col border border-[var(--color-glass-border)] overflow-hidden mb-4 origin-bottom-right"
          >
            <div className="bg-gradient-to-r from-accent to-emerald-500 text-white p-5 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                <span className="font-bold tracking-wide text-lg">Election Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-transform hover:rotate-90 duration-300">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  key={i} 
                  className={`max-w-[85%] rounded-2xl p-4 text-sm font-bold shadow-sm ${m.type === 'user' ? 'bg-gradient-to-r from-accent to-accent-light text-white self-end rounded-br-sm' : 'bg-[var(--color-secondary)] text-primary self-start rounded-bl-sm border border-[var(--color-glass-border)]'}`}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>
            
            <form onSubmit={sendMessage} className="p-4 border-t border-[var(--color-glass-border)] bg-[var(--color-secondary)]/60 flex gap-3">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-[var(--color-secondary)] text-primary border border-[var(--color-glass-border)] rounded-full px-5 py-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all shadow-inner"
                placeholder="Ask me anything..."
              />
              <button type="submit" className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-all flex items-center justify-center w-12 h-12 shadow-lg hover:-translate-y-1">
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-accent to-emerald-500 text-white w-16 h-16 rounded-full shadow-[0_15px_30px_rgba(19,136,8,0.3)] flex items-center justify-center hover:shadow-[0_15px_30px_rgba(255,153,51,0.4)] transition-all absolute bottom-0 right-0 border-2 border-white/20"
        >
          <MessageSquare size={28} />
        </motion.button>
      )}
    </div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
