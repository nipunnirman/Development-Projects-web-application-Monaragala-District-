import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';

import District from './src/models/District.js';
import DsDivision from './src/models/DsDivision.js';
import GnDivision from './src/models/GnDivision.js';
import Project from './src/models/Project.js';

// Helper to normalize Sinhala strings to avoid minor unicode/typing mismatches
function normalizeSinhala(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    // Normalize Siyambalanduwa spelling
    .replace('සියඹලාණ්ඩුව', 'සියඹලාන්ඩුව')
    .replace('සියඹලාණ්ඩුවට', 'සියඹලාන්ඩුවට')
    // GN spelling normalization
    .replace('කිවුලේයාය', 'කිවුලෙයාය')
    .replace('බෙරලියපොල', 'බෙරලිය පොල')
    ;
}

async function restoreProjects() {
  try {
    // Find the backup Excel file
    const dir = './';
    const files = fs.readdirSync(dir);
    const excelFile = files.find(f => f.includes('සංවර්ධන') && f.endsWith('.xlsx'));
    if (!excelFile) {
      console.error('❌ Excel file not found in backend directory!');
      process.exit(1);
    }
    console.log(`🔍 Found Excel backup file: "${excelFile}"`);

    console.log('📊 Parsing Excel sheets...');
    const workbook = xlsx.readFile(excelFile);

    const jsonOutput = []; // For projects_extracted.json
    const projectsToInsert = []; // For MongoDB upload

    // Fetch District placeholder or ID (we will resolve real IDs in DB phase)
    console.log('📝 Processing and formatting project rows...');
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      const isDistrictCommon = sheetName === 'දිස්ත්‍රික්කයේ පොදු' || sheetName === 'පොදු';
      let dsNameSi = isDistrictCommon ? 'දිස්ත්‍රික්කයේ පොදු' : sheetName;

      let currentKottasaya = null;
      let currentWasama = null;

      // Start parsing rows after header (usually rows 0, 1, 2 are titles/headers)
      for (let r = 3; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length === 0) continue;

        // Extract values
        const serial = row[0] ? String(row[0]).trim() : null;
        const kottasaya = row[1] ? String(row[1]).trim() : null;
        const wasama = row[2] ? String(row[2]).trim() : null;
        const projectName = row[3] ? String(row[3]).trim() : null;
        const valueNum = row[4] !== undefined && row[4] !== null ? parseFloat(row[4]) : 0;
        const fundingBody = row[5] ? String(row[5]).trim() : '';
        const implementingBody = row[6] ? String(row[6]).trim() : '';
        
        // Extract any extra columns beyond standard 7 columns
        const extraColumns = [];
        for (let c = 7; c < row.length; c++) {
          if (row[c]) extraColumns.push(String(row[c]).trim());
        }
        const extraDetails = extraColumns.join(' | ');

        // Skip "මුළු එකතුව" or "එකතුව" rows as they are sum totals
        const isTotal = (projectName && (projectName.includes('එකතුව') || projectName.includes('මුළු එකතුව'))) ||
                        (wasama && (wasama.includes('එකතුව') || wasama.includes('මුළු එකතුව'))) ||
                        (kottasaya && (kottasaya.includes('එකතුව') || kottasaya.includes('මුළු එකතුව')));
        if (isTotal) {
          continue;
        }

        // Update state machine
        if (kottasaya) {
          currentKottasaya = kottasaya;
        }
        if (wasama) {
          currentWasama = wasama;
        }

        // Skip if there's no project name (empty rows or note rows)
        if (!projectName) {
          continue;
        }

        // Construct cleaner JSON structure for projects_extracted.json
        jsonOutput.push({
          projectName,
          dsDivision: dsNameSi,
          gnDivision: currentWasama || 'පොදු',
          kottasaya: currentKottasaya || '',
          projectValue: valueNum,
          fundingBody,
          implementingBody,
          extraDetails,
          year: 2026,
          status: 'planned'
        });
      }
    }

    // 1. Write the projects_extracted.json file
    const jsonPath = path.resolve('./projects_extracted.json');
    console.log(`📁 Writing JSON file to: ${jsonPath}`);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
    console.log(`🎉 Successfully wrote ${jsonOutput.length} projects to JSON file!\n`);

    console.log('🔄 Connecting to MongoDB to upload projects...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Fetch District
    const district = await District.findOne({ name: 'Monaragala' });
    if (!district) {
      console.error('❌ Monaragala District not found in DB! Please make sure you have run npm run seed first.');
      process.exit(1);
    }
    console.log(`District: ${district.nameSi} (${district._id})`);

    // Fetch DS Divisions
    const dsDivisions = await DsDivision.find({});
    const dsMap = new Map(dsDivisions.map(d => [normalizeSinhala(d.nameSi), d]));
    
    // Fetch GN Divisions and group by DS Division ID for quick lookup
    const gnDivisions = await GnDivision.find({});
    const gnMap = new Map(); // key: dsId + '|' + normalized(gnNameSi)
    gnDivisions.forEach(gn => {
      gnMap.set(`${gn.dsDivisionId.toString()}|${normalizeSinhala(gn.nameSi)}`, gn);
    });

    console.log('🧩 Mapping projects to DB schema collections...');
    for (const item of jsonOutput) {
      const isDistrictCommon = item.dsDivision === 'දිස්ත්‍රික්කයේ පොදු' || item.dsDivision === 'පොදු';
      let dsId = null;
      
      if (!isDistrictCommon) {
        const normalizedSheetName = normalizeSinhala(item.dsDivision);
        const dsObj = dsMap.get(normalizedSheetName);
        if (dsObj) {
          dsId = dsObj._id;
        }
      }

      let gnId = null;
      let scope = 'specific';

      if (isDistrictCommon) {
        scope = 'public';
      } else {
        if (item.gnDivision && item.gnDivision !== 'පොදු') {
          const normWasama = normalizeSinhala(item.gnDivision);
          const gnObj = gnMap.get(`${dsId.toString()}|${normWasama}`);
          if (gnObj) {
            gnId = gnObj._id;
            scope = 'specific';
          } else {
            scope = 'public';
          }
        } else {
          scope = 'public';
        }
      }

      const details = [];
      if (item.fundingBody) details.push(`අරමුදල්: ${item.fundingBody}`);
      if (item.implementingBody) details.push(`ක්‍රියාත්මක කරන ආයතනය: ${item.implementingBody}`);
      if (item.extraDetails) details.push(`අමතර විස්තර: ${item.extraDetails}`);
      
      const description = `වර්ෂය: 2026 | ${details.join(' | ') || 'තොරතුරු නොමැත'}`;
      const estimatedAmount = item.projectValue * 1000000;

      projectsToInsert.push({
        projectName: item.projectName,
        description,
        scope,
        districtId: district._id,
        dsDivisionId: dsId,
        gnDivisionId: gnId,
        affectedDsDivisions: scope === 'public' && dsId ? [dsId] : [],
        affectedGnDivisions: [],
        estimatedAmount,
        status: 'planned',
        progress: 0,
        latitude: null,
        longitude: null,
        createdBy: 'mahinda'
      });
    }

    // 2. Clear existing Projects in MongoDB
    console.log('🗑️  Clearing existing projects from MongoDB...');
    const deleteResult = await Project.deleteMany({});
    console.log(`🗑️  Successfully cleared ${deleteResult.deletedCount} old projects.`);

    // 3. Upload new Projects to MongoDB
    console.log(`🚀 Uploading ${projectsToInsert.length} projects to MongoDB...`);
    const insertResult = await Project.insertMany(projectsToInsert);
    console.log(`🎉 Successfully inserted ${insertResult.length} projects into MongoDB!\n`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during restore:', err);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
}

restoreProjects();
