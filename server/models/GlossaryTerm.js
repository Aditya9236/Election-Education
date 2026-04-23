const mongoose = require('mongoose');

const glossaryTermSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    unique: true,
  },
  definition: {
    type: String,
    required: true,
  },
  relatedPhases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimelinePhase'
  }]
});

module.exports = mongoose.model('GlossaryTerm', glossaryTermSchema);
