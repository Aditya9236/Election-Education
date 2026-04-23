const mongoose = require('mongoose');
const TimelinePhase = require('./models/TimelinePhase');
const GlossaryTerm = require('./models/GlossaryTerm');
const QuizQuestion = require('./models/QuizQuestion');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/election_db';

const phases = [
  {
    phaseName: "Voter Registration",
    description: "Eligible citizens register with the local election authority to be able to cast their ballots.",
    orderIndex: 1,
    correctPlacementMessage: "Correct! Voter Registration is the crucial first step to ensure eligibility."
  },
  {
    phaseName: "Campaigning",
    description: "Candidates and parties communicate their platforms to the public to gain support and votes.",
    orderIndex: 2,
    correctPlacementMessage: "Great job! Once registered, voters listen to campaigns to make informed choices."
  },
  {
    phaseName: "Voting",
    description: "Registered voters cast their ballots either in person or by mail on election day or during early voting periods.",
    orderIndex: 3,
    correctPlacementMessage: "Exactly! Voting is the core mechanic of casting your ballot."
  },
  {
    phaseName: "Vote Counting",
    description: "Election officials securely tally the cast ballots using established, verifiable procedures.",
    orderIndex: 4,
    correctPlacementMessage: "Spot on! Every eligible vote must be counted accurately."
  },
  {
    phaseName: "Results Declaration",
    description: "Final, certified results are announced, and the winner is officially declared.",
    orderIndex: 5,
    correctPlacementMessage: "You got it! Results are declared once counting and certification are complete."
  }
];

const terms = [
  {
    term: "Ballot",
    definition: "The physical or electronic document used by a voter to cast their vote."
  },
  {
    term: "Constituency",
    definition: "A specific geographic area that an elected official represents."
  },
  {
    term: "Incumbent",
    definition: "The current holder of an elected office."
  },
  {
    term: "Polling Station",
    definition: "The designated location where voters go to cast their ballots."
  }
];

const questions = [
  {
    question: "What is the primary purpose of voter registration?",
    options: [
      "To pay election taxes",
      "To verify eligibility and prevent fraud",
      "To choose a political party officially",
      "To count the final votes"
    ],
    correctOptionIndex: 1,
    explanation: "Voter registration ensures that only eligible citizens cast a ballot and helps prevent individuals from voting more than once."
  },
  {
    question: "Which phase directly follows the campaigning period?",
    options: [
      "Results Declaration",
      "Vote Counting",
      "Voting",
      "Voter Registration"
    ],
    correctOptionIndex: 2,
    explanation: "After candidates have presented their platforms during campaigning, the voters cast their ballots during the voting phase."
  },
  {
    question: "Who is responsible for the 'Vote Counting' phase?",
    options: [
      "The candidates",
      "The media",
      "Election officials",
      "The voters"
    ],
    correctOptionIndex: 2,
    explanation: "Election officials are trained and legally mandated to securely and accurately count the ballots."
  },
  {
    question: "Why is the 'Secret Ballot' important in a democracy?",
    options: [
      "It makes counting faster",
      "It prevents voter intimidation and coercion",
      "It allows candidates to see who voted for them",
      "It saves money on ballot printing"
    ],
    correctOptionIndex: 1,
    explanation: "A secret ballot ensures that each voter makes their choice privately, preventing anyone from forcing or buying their vote."
  },
  {
    question: "What does the term 'Constituency' refer to?",
    options: [
      "A specific geographic area represented by an elected official",
      "The rules that govern an election",
      "The box where ballots are collected",
      "The machine used to tally votes"
    ],
    correctOptionIndex: 0,
    explanation: "A constituency (or electoral district) is a distinct territorial subdivision for holding a separate election for one or more seats."
  },
  {
    question: "What generally happens at a 'Polling Station'?",
    options: [
      "Candidates hold debates",
      "Election laws are written",
      "Registered voters go to cast their ballots",
      "The final election results are broadcasted"
    ],
    correctOptionIndex: 2,
    explanation: "A polling station is the physical or designated location where eligible voters go to securely cast their votes on election day."
  }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await TimelinePhase.deleteMany({});
    await GlossaryTerm.deleteMany({});
    await QuizQuestion.deleteMany({});

    // Seed data
    const insertedPhases = await TimelinePhase.insertMany(phases);
    
    // Map related phases to terms
    const ballotTerm = terms.find(t => t.term === "Ballot");
    ballotTerm.relatedPhases = [insertedPhases.find(p => p.phaseName === "Voting")._id];
    
    const pollingStationTerm = terms.find(t => t.term === "Polling Station");
    pollingStationTerm.relatedPhases = [insertedPhases.find(p => p.phaseName === "Voting")._id];

    await GlossaryTerm.insertMany(terms);
    await QuizQuestion.insertMany(questions);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDB();
