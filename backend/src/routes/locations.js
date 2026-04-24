import express from 'express';
import District from '../models/District.js';
import DsDivision from '../models/DsDivision.js';
import GnDivision from '../models/GnDivision.js';

const router = express.Router();

// GET /api/districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await District.find().sort({ name: 1 });
    res.json({ success: true, data: districts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/ds-divisions/:districtId
router.get('/ds-divisions/:districtId', async (req, res) => {
  try {
    const { districtId } = req.params;
    const dsDivisions = await DsDivision.find({ districtId }).sort({ name: 1 });
    res.json({ success: true, data: dsDivisions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/gn-divisions/:dsId
router.get('/gn-divisions/:dsId', async (req, res) => {
  try {
    const { dsId } = req.params;
    const gnDivisions = await GnDivision.find({ dsDivisionId: dsId }).sort({ name: 1 });
    res.json({ success: true, data: gnDivisions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
