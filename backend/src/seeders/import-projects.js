import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import District from '../models/District.js';
import DsDivision from '../models/DsDivision.js';
import GnDivision from '../models/GnDivision.js';
import Project from '../models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importProjects = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to Database');

    const filePath = path.resolve(__dirname, '../../projects_extracted.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const projectsData = JSON.parse(rawData);

    console.log(`📦 Loaded ${projectsData.length} projects from projects_extracted.json`);

    // We know District is Monaragala
    const district = await District.findOne({ name: 'Monaragala' });
    if (!district) {
      throw new Error('Monaragala District not found in DB! Have you run `npm run seed`?');
    }

    // Clear existing projects to avoid duplicates
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects from DB');

    // Fetch all DS and GN divisions and store them in a Map for quick lookup
    const dsDivisions = await DsDivision.find({});
    const gnDivisions = await GnDivision.find({});
    
    const dsMap = new Map(dsDivisions.map(d => [d.nameSi, d._id]));
    // Map with a compound key: dsNameSi + '|' + gnNameSi (in case GN names are duplicated across DSs)
    const gnMap = new Map();
    for (const gn of gnDivisions) {
      const ds = dsDivisions.find(d => d._id.toString() === gn.dsDivisionId.toString());
      if (ds) {
        gnMap.set(`${ds.nameSi}|${gn.nameSi}`, gn._id);
      }
    }

    const projectsToInsert = [];
    let skipped = 0;

    for (let data of projectsData) {
      if (data.dsDivision === 'සියඹලාණ්ඩුව') {
        data.dsDivision = 'සියඹලාන්ඩුව';
      }
      const dsId = dsMap.get(data.dsDivision) || null;
      
      let gnId = null;
      let scope = 'specific';

      if (data.dsDivision === 'දිස්ත්‍රික්කයේ පොදු' || data.dsDivision === 'පොදු') {
        scope = 'public';
      } else if (!dsId) {
        console.warn(`⚠️  DS Division "${data.dsDivision}" not found in DB. Skipping project: "${data.projectName}"`);
        skipped++;
        continue;
      }

      if (scope !== 'public') {
        if (data.gnDivision === 'පොදු') {
          // "Common" / Public project within a DS
          scope = 'public';
        } else {
          gnId = gnMap.get(`${data.dsDivision}|${data.gnDivision}`);
          if (!gnId) {
            console.warn(`⚠️  GN Division "${data.gnDivision}" (under ${data.dsDivision}) not found in DB. Setting scope to public/DS wide.`);
            scope = 'public';
          }
        }
      }

      // Format description using extra fields since Project.js requires description
      const description = `වර්ෂය: ${data.year} | අරමුදල්: ${data.fundingBody || 'නොමැත'} | ක්‍රියාත්මක කරන ආයතනය: ${data.implementingBody || 'නොමැත'}`;

      // Estimated amount calculation (assuming 2.0 = 2 Million LKR)
      const estimatedAmount = (data.projectValue || 0) * 1000000;

      projectsToInsert.push({
        projectName: data.projectName,
        description: description,
        scope: scope,
        districtId: district._id,
        dsDivisionId: dsId,
        gnDivisionId: gnId,
        affectedDsDivisions: scope === 'public' ? [dsId] : [], // if public, affects the whole DS
        affectedGnDivisions: [],
        estimatedAmount: estimatedAmount,
        status: data.status === 'planned' ? 'planned' : (data.status || 'planned'),
        progress: 0,
        latitude: null,
        longitude: null,
      });
    }

    if (projectsToInsert.length > 0) {
      await Project.insertMany(projectsToInsert);
      console.log(`\n🎉 Successfully imported ${projectsToInsert.length} projects!`);
      if (skipped > 0) console.log(`⏩ Skipped ${skipped} projects due to missing divisions.`);
    } else {
      console.log('\n❌ No valid projects found to insert.');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during import:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

importProjects();
