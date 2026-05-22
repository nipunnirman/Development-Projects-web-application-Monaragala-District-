import express from 'express';
import District from '../models/District.js';
import DsDivision from '../models/DsDivision.js';
import GnDivision from '../models/GnDivision.js';
import dbCache from '../utils/cache.js';

const router = express.Router();

// GET /api/districts
router.get('/districts', async (req, res) => {
  try {
    const cacheKey = 'districts';
    const cached = dbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const districts = await District.find().sort({ name: 1 });
    const responseData = { success: true, data: districts };
    
    // Cache for 10 minutes (600,000 ms)
    dbCache.set(cacheKey, responseData, 600000);
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/ds-divisions/:districtId
router.get('/ds-divisions/:districtId', async (req, res) => {
  try {
    const { districtId } = req.params;
    const cacheKey = `ds-divisions-${districtId}`;
    const cached = dbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const dsDivisions = await DsDivision.find({ districtId }).sort({ name: 1 });
    const responseData = { success: true, data: dsDivisions };
    
    // Cache for 10 minutes (600,000 ms)
    dbCache.set(cacheKey, responseData, 600000);
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/gn-divisions/:dsId
router.get('/gn-divisions/:dsId', async (req, res) => {
  try {
    const { dsId } = req.params;
    const cacheKey = `gn-divisions-${dsId}`;
    const cached = dbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const gnDivisions = await GnDivision.find({ dsDivisionId: dsId }).sort({ name: 1 });
    const responseData = { success: true, data: gnDivisions };
    
    // Cache for 10 minutes (600,000 ms)
    dbCache.set(cacheKey, responseData, 600000);
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
