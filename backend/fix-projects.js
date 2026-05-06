import mongoose from 'mongoose';
import 'dotenv/config';
import Project from './src/models/Project.js';

async function fixProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find projects that have no dsDivisionId but are marked as specific
    // These are likely intended to be public projects
    const result = await Project.updateMany(
      { dsDivisionId: null, scope: 'specific' },
      { scope: 'public' }
    );

    console.log(`Updated ${result.modifiedCount} projects to scope: 'public'`);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing projects:', err);
    process.exit(1);
  }
}

fixProjects();
