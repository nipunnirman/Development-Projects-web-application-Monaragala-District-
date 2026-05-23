import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  contactInfo: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true,
  },
  suggestion: {
    type: String,
    required: [true, 'Suggestion text is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

export default Suggestion;
