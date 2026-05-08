/**
 * Run with: node src/seeders/remove-default-admin.js
 * Removes the old default "admin" account from MongoDB.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';

await connectDB();

const result = await Admin.deleteOne({ username: 'admin' });

if (result.deletedCount > 0) {
  console.log('✅ Default "admin" account removed successfully.');
} else {
  console.log('ℹ️  No "admin" account found — already removed or never existed.');
}

// Show remaining admins
const remaining = await Admin.find({}, 'username');
console.log('\n📋 Remaining admin accounts:');
remaining.forEach(a => console.log(`  - ${a.username}`));

await mongoose.disconnect();
