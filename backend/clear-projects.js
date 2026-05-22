import mongoose from 'mongoose';
import 'dotenv/config';
import Project from './src/models/Project.js';

async function clearProjects() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Count projects before deletion
    const countBefore = await Project.countDocuments({});
    console.log(`Found ${countBefore} projects in the database.`);

    if (countBefore === 0) {
      console.log('No projects found to delete.');
      process.exit(0);
    }

    // Delete all projects
    const result = await Project.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} projects.`);
    console.log('Note: District names, DS division names, GN division names, and Admin accounts were not modified.');

    process.exit(0);
  } catch (err) {
    console.error('Error clearing projects:', err);
    process.exit(1);
  }
}

clearProjects();
