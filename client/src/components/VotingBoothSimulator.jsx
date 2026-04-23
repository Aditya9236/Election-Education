import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProgressStore from '../store/useProgressStore';
import { CheckCircle, Fingerprint, Lock, Mailbox, UserCheck, ShieldCheck } from 'lucide-react';

export default function VotingBoothSimulator() {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const setVotingSimulatorCompleted = useProgressStore(state => state.setVotingSimulatorCompleted);

  const nextStep = () => setStep(prev => prev + 1);

  const handleVoteSubmission = () => {
    setVotingSimulatorCompleted(true);
    nextStep();
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-8 min-h-screen"
    >
      <h2 className="text-5xl font-extrabold text-primary mb-3">Mock Voting Booth Simulator</h2>
      <p className="mb-10 text-primary/80 text-lg font-medium">Experience the step-by-step process of casting a ballot securely.</p>

      <div className="relative glass rounded-3xl overflow-hidden min-h-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t-4 border-emerald-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200/20">
          <motion.div 
            className="h-full bg-gradient-to-r from-accent to-emerald-500 shadow-[0_0_15px_rgba(255,153,51,0.6)]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        <div className="p-8 md:p-12 relative h-full flex flex-col justify-center items-center">
          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center shadow-inner relative group border border-accent/20">
                  <div className="absolute inset-0 bg-accent/20 rounded-full scale-110 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700"></div>
                  <Fingerprint className="w-16 h-16 text-accent relative z-10" />
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-primary mb-4">Step 1: ID Verification</h3>
                  <p className="text-primary/80 leading-relaxed text-lg">
                    Before entering the booth, a poll worker verifies your identity and ensures you are registered in this constituency. This prevents fraud and duplicate voting.
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="bg-gradient-to-r from-accent to-accent-light text-white px-10 py-4 rounded-xl font-bold text-lg shadow-[0_10px_20px_rgba(255,153,51,0.3)] hover:shadow-[0_10px_30px_rgba(255,153,51,0.5)] transition-all w-full sm:w-auto"
                >
                  Verify ID & Proceed
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-secondary)] to-transparent rounded-2xl flex items-center justify-center border border-[var(--color-glass-border)] shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/20 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <Lock className="w-14 h-14 text-emerald-500 relative z-10" />
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-primary mb-4">Step 2: The Privacy Booth</h3>
                  <p className="text-primary/80 leading-relaxed text-lg">
                    Voting is a private act. The secret ballot ensures that no one can intimidate or coerce you into voting a certain way.
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-[0_10px_20px_rgba(19,136,8,0.3)] hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  Close Curtain <Lock className="w-5 h-5"/>
                </motion.button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col space-y-8 w-full max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <h3 className="text-4xl font-extrabold text-primary mb-2">Step 3: Make Your Selection</h3>
                  <p className="text-primary/80 text-lg">Select one representative for the fictional City Council.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCandidate('bluejay')}
                    className={`p-8 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden ${selectedCandidate === 'bluejay' ? 'bg-accent/10 border-2 border-accent shadow-[0_0_30px_rgba(255,153,51,0.3)]' : 'glass border border-[var(--color-glass-border)] hover:border-accent/50 hover:shadow-lg'}`}
                  >
                    {selectedCandidate === 'bluejay' && <div className="absolute top-4 right-4 bg-accent text-white rounded-full p-1 shadow-sm"><CheckCircle size={16}/></div>}
                    <div className={`p-4 rounded-full ${selectedCandidate === 'bluejay' ? 'bg-accent/20' : 'bg-[var(--color-secondary)] border border-[var(--color-glass-border)]'}`}>
                      <UserCheck className={`w-10 h-10 ${selectedCandidate === 'bluejay' ? 'text-accent' : 'text-primary/40'}`} />
                    </div>
                    <h4 className="font-extrabold text-2xl text-primary">The Saffron Party</h4>
                    <p className="text-primary/70 text-center font-medium">Focuses on urban development and expanding public parks.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCandidate('cardinal')}
                    className={`p-8 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 relative overflow-hidden ${selectedCandidate === 'cardinal' ? 'bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_30px_rgba(19,136,8,0.3)]' : 'glass border border-[var(--color-glass-border)] hover:border-emerald-500/50 hover:shadow-lg'}`}
                  >
                    {selectedCandidate === 'cardinal' && <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-1 shadow-sm"><CheckCircle size={16}/></div>}
                    <div className={`p-4 rounded-full ${selectedCandidate === 'cardinal' ? 'bg-emerald-500/20' : 'bg-[var(--color-secondary)] border border-[var(--color-glass-border)]'}`}>
                      <UserCheck className={`w-10 h-10 ${selectedCandidate === 'cardinal' ? 'text-emerald-500' : 'text-primary/40'}`} />
                    </div>
                    <h4 className="font-extrabold text-2xl text-primary">The Green Party</h4>
                    <p className="text-primary/70 text-center font-medium">Focuses on civic infrastructure and modernizing education.</p>
                  </motion.div>
                </div>

                <div className="flex justify-center mt-6">
                  <motion.button 
                    whileHover={selectedCandidate ? { scale: 1.05 } : {}}
                    whileTap={selectedCandidate ? { scale: 0.95 } : {}}
                    disabled={!selectedCandidate}
                    onClick={handleVoteSubmission}
                    className={`px-12 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 ${selectedCandidate ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-[0_10px_30px_rgba(19,136,8,0.4)]' : 'bg-[var(--color-secondary)] border border-[var(--color-glass-border)] text-primary/40 cursor-not-allowed shadow-none'}`}
                  >
                    <ShieldCheck size={24} /> Cast Secure Ballot
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-full flex items-center justify-center relative overflow-hidden shadow-inner border border-emerald-500/30"
                >
                  <Mailbox className="w-14 h-14 text-emerald-500 z-10" />
                  <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                    className="absolute w-12 h-16 bg-white border border-gray-200 shadow-md z-0 rounded-sm"
                  />
                </motion.div>
                <div>
                  <h3 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center justify-center gap-3">
                    <CheckCircle className="w-10 h-10" /> Ballot Submitted
                  </h3>
                  <p className="text-primary/80 leading-relaxed text-lg mb-6">
                    Your mock ballot has been securely stored. In a real election, this physical or electronic record is securely transported and tallied by authorized, impartial election officials.
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-6 py-4 rounded-xl font-bold shadow-sm text-lg">
                    Voting Booth Simulation complete! Check out the other modules.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
