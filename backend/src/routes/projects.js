import express from 'express';
import Project from '../models/Project.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import dbCache from '../utils/cache.js';

const router = express.Router();

// GET /api/projects  (public - with filters)
router.get('/', async (req, res) => {
  try {
    const cacheKey = `projects-${JSON.stringify(req.query)}`;
    const cached = dbCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const { district, ds, gn, status, scope } = req.query;
    const filter = {};

    if (district) filter.districtId = district;

    if (scope === 'public') {
      // GN-level "පොදු" button inside a specific DS: show DS-specific public projects only
      // (projects that belong to this DS but have no specific GN division)
      filter.scope = 'public';
      if (ds && ds !== 'public') {
        filter.affectedDsDivisions = ds;
      }
    } else if (gn) {
      filter.gnDivisionId = gn;
    } else if (ds) {
      if (ds === 'public') {
        // DS-level "දිස්ත්‍රික්කයේ පොදු" button: show ONLY district-wide projects
        filter.scope = 'public';
        filter.dsDivisionId = null;
      } else {
        filter.dsDivisionId = ds;
      }
    }

    // No DS/GN filter → show ALL projects (specific + public)

    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate('districtId', 'name nameSi')
      .populate('dsDivisionId', 'name nameSi')
      .populate('gnDivisionId', 'name nameSi')
      .populate('affectedDsDivisions', 'name nameSi')
      .populate('affectedGnDivisions', 'name nameSi')
      .sort({ createdAt: -1 })
      .lean();

    const responseData = { success: true, count: projects.length, data: projects };
    dbCache.set(cacheKey, responseData, 300000); // 5 minutes TTL

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('districtId', 'name nameSi')
      .populate('dsDivisionId', 'name nameSi')
      .populate('gnDivisionId', 'name nameSi');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/projects  (protected - admin only)
router.post('/', protect, async (req, res) => {
  try {
    const {
      projectName, description,
      districtId, dsDivisionId, gnDivisionId,
      latitude, longitude,
      startDate, endDate, status,
      estimatedAmount, progress,
    } = req.body;

    const project = await Project.create({
      projectName, description,
      scope: req.body.scope || 'specific',
      districtId, dsDivisionId, gnDivisionId,
      affectedDsDivisions: req.body.affectedDsDivisions || [],
      affectedGnDivisions: req.body.affectedGnDivisions || [],
      latitude: latitude || null,
      longitude: longitude || null,
      startDate, endDate, status,
      estimatedAmount: estimatedAmount || 0,
      progress: progress || 0,
      createdBy: req.admin?.username || 'mahinda',
    });

    const populated = await project.populate([
      { path: 'districtId', select: 'name nameSi' },
      { path: 'dsDivisionId', select: 'name nameSi' },
      { path: 'gnDivisionId', select: 'name nameSi' },
    ]);

    dbCache.clear();
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/projects/:id  (protected - admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('districtId', 'name nameSi')
      .populate('dsDivisionId', 'name nameSi')
      .populate('gnDivisionId', 'name nameSi')
      .populate('affectedDsDivisions', 'name nameSi')
      .populate('affectedGnDivisions', 'name nameSi');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    dbCache.clear();
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/projects/:id  (protected - admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    dbCache.clear();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/projects/:id/upload (protected - admin only)
router.post('/:id/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.images.push(req.file.path);
    await project.save();

    dbCache.clear();
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
