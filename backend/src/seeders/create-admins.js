/**
 * Run with: node src/seeders/create-admins.js
 * Creates 2 admin users. Safe to run multiple times (upserts).
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';

const admins = [
  { username: 'mahinda_rathnayaka', password: 'Mahinda@2025!' },
  { username: 'padmalatha_silva',   password: 'Padmala@2025!' },
];

await connectDB();

for (const a of admins) {
  const existing = await Admin.findOne({ username: a.username });
  if (existing) {
    console.log(`✅ Already exists: ${a.username}`);
  } else {
    await Admin.create(a);
    console.log(`✅ Created: ${a.username}`);
  }
}

console.log('\n🎉 Done! Admin accounts are ready.');
await mongoose.disconnect();
