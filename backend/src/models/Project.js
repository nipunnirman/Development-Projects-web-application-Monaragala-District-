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
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: [true, 'District is required'],
  },
  dsDivisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DsDivision',
    required: [true, 'DS Division is required'],
  },
  gnDivisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GnDivision',
    required: [true, 'GN Division is required'],
  },
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
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed'],
    default: 'planned',
  },
  images: [{
    type: String
  }],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
