import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  // scope: 'specific' = belongs to one DS/GN | 'public' = district-wide (e.g. roads crossing many divisions)
  scope: {
    type: String,
    enum: ['specific', 'public'],
    default: 'specific',
  },
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: [true, 'District is required'],
  },
  // Required only for scope=specific
  dsDivisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DsDivision',
    default: null,
  },
  gnDivisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GnDivision',
    default: null,
  },
  // For scope=public: list of DS divisions this project passes through
  affectedDsDivisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DsDivision',
  }],
  // For scope=public: list of GN divisions this project passes through (optional)
  affectedGnDivisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GnDivision',
  }],
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed'],
    default: 'planned',
  },
  images: [{
    type: String
  }],
  estimatedAmount: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
