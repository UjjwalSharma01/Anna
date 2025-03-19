const Crop = require('../models/Crop');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all crops for a user
// @route   GET /api/crops
// @access  Private
const getUserCrops = asyncHandler(async (req, res) => {
  const crops = await Crop.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ crops });
});

// @desc    Get a single crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  
  if (crop && crop.user.toString() === req.user._id.toString()) {
    res.json(crop);
  } else if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  } else {
    res.status(403);
    throw new Error('Not authorized to access this crop');
  }
});

// @desc    Create a new crop
// @route   POST /api/crops
// @access  Private
const createCrop = asyncHandler(async (req, res) => {
  const { name, cropType, area, plantingDate, expectedHarvestDate, notes, estimatedYield } = req.body;
  
  if (!name || !cropType || !area || !plantingDate) {
    res.status(400);
    throw new Error('Name, crop type, area, and planting date are required');
  }
  
  const crop = await Crop.create({
    name,
    user: req.user._id,
    cropType,
    area,
    plantingDate,
    expectedHarvestDate: expectedHarvestDate || null,
    notes: notes || '',
    estimatedYield: estimatedYield || 0
  });
  
  res.status(201).json(crop);
});

// @desc    Update a crop
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  
  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }
  
  if (crop.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this crop');
  }
  
  const updatedData = {
    name: req.body.name || crop.name,
    cropType: req.body.cropType || crop.cropType,
    area: req.body.area || crop.area,
    plantingDate: req.body.plantingDate || crop.plantingDate,
    expectedHarvestDate: req.body.expectedHarvestDate || crop.expectedHarvestDate,
    status: req.body.status || crop.status,
    notes: req.body.notes || crop.notes,
    estimatedYield: req.body.estimatedYield || crop.estimatedYield,
    actualYield: req.body.actualYield || crop.actualYield
  };
  
  const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  res.json(updatedCrop);
});

// @desc    Add expense to a crop
// @route   POST /api/crops/:id/expenses
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
  const { item, cost } = req.body;
  
  if (!item || !cost) {
    res.status(400);
    throw new Error('Item name and cost are required');
  }
  
  const crop = await Crop.findById(req.params.id);
  
  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }
  
  if (crop.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this crop');
  }
  
  crop.expenses.push({
    item,
    cost,
    date: req.body.date || new Date()
  });
  
  await crop.save();
  res.json(crop);
});

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.findById(req.params.id);
  
  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }
  
  if (crop.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this crop');
  }
  
  await crop.remove();
  res.json({ message: 'Crop removed successfully' });
});

module.exports = {
  getUserCrops,
  getCropById,
  createCrop,
  updateCrop,
  addExpense,
  deleteCrop
};
