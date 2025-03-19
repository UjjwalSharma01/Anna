const Scheme = require('../models/Scheme');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
const getSchemes = asyncHandler(async (req, res) => {
  const schemes = await Scheme.find({}).sort({ createdAt: -1 });
  res.json({ schemes });
});

// @desc    Get scheme by ID
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  
  if (scheme) {
    res.json(scheme);
  } else {
    res.status(404);
    throw new Error('Scheme not found');
  }
});

// @desc    Create a new scheme (admin only)
// @route   POST /api/schemes
// @access  Private/Admin
const createScheme = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    category, 
    imageUrl, 
    eligibility, 
    benefits, 
    applicationProcess,
    documentRequired,
    deadline,
    website,
    featured
  } = req.body;
  
  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Title, description, and category are required');
  }
  
  const scheme = await Scheme.create({
    title,
    description,
    category,
    imageUrl: imageUrl || '/images/default.jpg',
    eligibility: eligibility || '',
    benefits: benefits || '',
    applicationProcess: applicationProcess || '',
    documentRequired: documentRequired || [],
    deadline: deadline || null,
    website: website || '',
    featured: featured || false
  });
  
  res.status(201).json(scheme);
});

// @desc    Update a scheme (admin only)
// @route   PUT /api/schemes/:id
// @access  Private/Admin
const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  
  if (scheme) {
    scheme.title = req.body.title || scheme.title;
    scheme.description = req.body.description || scheme.description;
    scheme.category = req.body.category || scheme.category;
    scheme.imageUrl = req.body.imageUrl || scheme.imageUrl;
    scheme.eligibility = req.body.eligibility || scheme.eligibility;
    scheme.benefits = req.body.benefits || scheme.benefits;
    scheme.applicationProcess = req.body.applicationProcess || scheme.applicationProcess;
    scheme.documentRequired = req.body.documentRequired || scheme.documentRequired;
    scheme.deadline = req.body.deadline || scheme.deadline;
    scheme.website = req.body.website || scheme.website;
    scheme.featured = req.body.featured !== undefined ? req.body.featured : scheme.featured;
    
    const updatedScheme = await scheme.save();
    res.json(updatedScheme);
  } else {
    res.status(404);
    throw new Error('Scheme not found');
  }
});

// @desc    Delete a scheme (admin only)
// @route   DELETE /api/schemes/:id
// @access  Private/Admin
const deleteScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  
  if (scheme) {
    await scheme.remove();
    res.json({ message: 'Scheme removed' });
  } else {
    res.status(404);
    throw new Error('Scheme not found');
  }
});

// @desc    Apply for a scheme
// @route   POST /api/schemes/:id/apply
// @access  Private
const applyForScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  
  if (!scheme) {
    res.status(404);
    throw new Error('Scheme not found');
  }
  
  // In a real application, we would save the application details
  // For now, just return a success message
  res.json({ 
    message: 'Application submitted successfully',
    scheme: scheme.title,
    applicant: req.user.username,
    applicationDate: new Date()
  });
});

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  applyForScheme
};
