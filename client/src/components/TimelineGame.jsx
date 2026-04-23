import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import useProgressStore from '../store/useProgressStore';
import { CheckCircle, GripVertical } from 'lucide-react';

function SortableItem({ id, phase }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`glass mb-3 p-5 rounded-xl cursor-grab active:cursor-grabbing border-l-4 ${isDragging ? 'border-accent shadow-2xl scale-[1.02] bg-[var(--color-secondary)]' : 'border-primary/50 shadow-sm hover:shadow-md hover:border-accent'} transition-all duration-200 flex items-center gap-4`}
    >
      <div className="text-primary/40">
        <GripVertical size={20} />
      </div>
      <h3 className="font-semibold text-lg text-primary">{phase.phaseName}</h3>
    </div>
  );
}

export default function TimelineGame() {
  const [phases, setPhases] = useState([]);
  const [scrambledPhases, setScrambledPhases] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const setTimelineCompleted = useProgressStore((state) => state.setTimelineCompleted);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    axios.get('http://localhost:5000/api/timeline')
      .then(res => {
        setPhases(res.data);
        const scrambled = [...res.data].sort(() => Math.random() - 0.5);
        setScrambledPhases(scrambled);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setScrambledPhases((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        checkCorrectness(newArray);
        return newArray;
      });
    } else {
      checkCorrectness(scrambledPhases);
    }
  };

  const checkCorrectness = (currentArray) => {
    const isSorted = currentArray.every((val, index) => val.orderIndex === index + 1);
    setIsCorrect(isSorted);
    if (isSorted) setTimelineCompleted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto py-8 min-h-screen"
    >
      <h2 className="text-5xl font-extrabold text-primary mb-3">Build the Timeline</h2>
      <p className="mb-10 text-primary/80 text-lg font-medium">Drag and drop the phases below into the correct chronological order to understand how an election is structured.</p>

      <AnimatePresence>
        {isCorrect && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            className="glass border border-emerald-500/50 text-emerald-800 dark:text-emerald-300 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 shadow-lg overflow-hidden relative bg-emerald-500/10"
          >
            <div className="absolute inset-0 bg-emerald-500/10"></div>
            <CheckCircle className="w-8 h-8 text-emerald-500 relative z-10" />
            <span className="relative z-10 text-lg"><strong>Excellent!</strong> You've correctly ordered the election phases.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={scrambledPhases.map(p => p._id)} strategy={verticalListSortingStrategy}>
          <div className="glass p-8 rounded-2xl shadow-xl border-t-4 border-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full filter blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-2xl"></div>
            {scrambledPhases.map((phase) => (
              <SortableItem key={phase._id} id={phase._id} phase={phase} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AnimatePresence>
        {isCorrect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 space-y-6"
          >
            <h3 className="text-3xl font-bold text-primary border-b-2 border-accent/20 pb-4 inline-block">Phase Details</h3>
            {phases.map((phase, idx) => (
              <motion.div 
                key={phase._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                className="glass p-6 rounded-xl shadow-md border-l-4 border-accent relative overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 text-8xl font-black text-accent select-none">{phase.orderIndex}</div>
                <h4 className="font-bold text-2xl text-primary mb-2 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-accent to-accent-light text-white px-3 py-1 rounded-lg text-sm shadow-sm">{phase.orderIndex}</span>
                  {phase.phaseName}
                </h4>
                <p className="text-primary/80 font-medium text-lg leading-relaxed mb-4 relative z-10">{phase.description}</p>
                <p className="text-md font-bold text-emerald-700 dark:text-emerald-300 flex gap-2 items-center bg-emerald-500/10 border border-emerald-500/20 w-fit px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> {phase.correctPlacementMessage}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
