import { create } from 'zustand';

const useProgressStore = create((set) => ({
  timelineCompleted: false,
  votingSimulatorCompleted: false,
  quizScore: null,
  totalQuizQuestions: null,
  badgeAwarded: false,

  setTimelineCompleted: (status) => set({ timelineCompleted: status }),
  setVotingSimulatorCompleted: (status) => set({ votingSimulatorCompleted: status }),
  setQuizScore: (score, total) => set({ quizScore: score, totalQuizQuestions: total }),
  
  checkBadge: () => set((state) => {
    if (state.timelineCompleted && state.votingSimulatorCompleted && state.quizScore !== null) {
      return { badgeAwarded: true };
    }
    return { badgeAwarded: false };
  }),
  
  resetProgress: () => set({
    timelineCompleted: false,
    votingSimulatorCompleted: false,
    quizScore: null,
    totalQuizQuestions: null,
    badgeAwarded: false,
  }),
}));

export default useProgressStore;
