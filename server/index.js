const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const TimelinePhase = require('./models/TimelinePhase');
const GlossaryTerm = require('./models/GlossaryTerm');
const QuizQuestion = require('./models/QuizQuestion');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For dev
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/election_db';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// REST Endpoints
app.get('/api/timeline', async (req, res) => {
  try {
    const phases = await TimelinePhase.find().sort({ orderIndex: 1 });
    res.json(phases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline phases' });
  }
});

app.get('/api/glossary', async (req, res) => {
  try {
    const terms = await GlossaryTerm.find().populate('relatedPhases');
    res.json(terms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch glossary terms' });
  }
});

app.get('/api/quiz', async (req, res) => {
  try {
    // In a real app we might pick a random selection, here we return all
    const questions = await QuizQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Socket.io for Interactive Assistant
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send a welcome message
  socket.emit('assistant_message', {
    text: "Welcome to the Election Education Portal! I'm your interactive assistant. I'll be here to guide you.",
    type: 'system'
  });

  socket.on('user_progress', (data) => {
    // React to user progress
    if (data.event === 'timeline_completed') {
      socket.emit('assistant_message', {
        text: "Great job completing the timeline! Ask me if you need any terms defined before the quiz.",
        type: 'system'
      });
    } else if (data.event === 'voting_simulator_completed') {
      socket.emit('assistant_message', {
        text: "You've successfully cast a mock ballot! How did the process feel?",
        type: 'system'
      });
    }
  });

  socket.on('user_message', (msg) => {
    // Simple echo/bot logic
    console.log(`Received message: ${msg}`);
    let reply = "I'm still learning! Try completing the timeline or voting simulator.";
    
    if (msg.toLowerCase().includes('help')) {
      reply = "I can help you understand the election process! Try building the timeline first.";
    } else if (msg.toLowerCase().includes('ballot')) {
      reply = "A ballot is the document you use to cast your vote.";
    }

    setTimeout(() => {
      socket.emit('assistant_message', { text: reply, type: 'assistant' });
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
