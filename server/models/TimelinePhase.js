const mongoose = require('mongoose');

const timelinePhaseSchema = new mongoose.Schema({
  phaseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  orderIndex: {
    type: Number,
    required: true,
    unique: true,
  },
  correctPlacementMessage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('TimelinePhase', timelinePhaseSchema);
