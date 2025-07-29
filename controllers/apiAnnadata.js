const AnnaData = require("../models/annadata");
const User = require("../models/user");

// GET /api/annadata - Get all annadata records (with pagination)
module.exports.getAllRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const records = await AnnaData.find()
            .populate('author', 'username location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AnnaData.countDocuments();

        res.json({
            success: true,
            data: {
                records,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            },
            message: "AnnaData records retrieved successfully"
        });
    } catch (err) {
        console.error("Error fetching annadata records:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching annadata records",
            error: err.message
        });
    }
};

// GET /api/annadata/user - Get current user's annadata records
module.exports.getUserRecords = async (req, res) => {
    try {
        const records = await AnnaData.find({ author: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: records,
            message: "User annadata records retrieved successfully"
        });
    } catch (err) {
        console.error("Error fetching user annadata records:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching user annadata records",
            error: err.message
        });
    }
};

// GET /api/annadata/:id - Get a specific annadata record
module.exports.getRecord = async (req, res) => {
    try {
        const record = await AnnaData.findById(req.params.id)
            .populate('author', 'username location');

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "AnnaData record not found"
            });
        }

        res.json({
            success: true,
            data: record,
            message: "AnnaData record retrieved successfully"
        });
    } catch (err) {
        console.error("Error fetching annadata record:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching annadata record",
            error: err.message
        });
    }
};

// POST /api/annadata - Create a new annadata record
module.exports.createRecord = async (req, res) => {
    try {
        const {
            title,
            description,
            cropType,
            landArea,
            location,
            season,
            yieldExpected,
            actualYield,
            costInvested,
            revenue,
            notes,
            status,
            plantingDate,
            harvestDate
        } = req.body;

        // Validation
        if (!title || !description || !cropType || !landArea || !location || !season) {
            return res.status(400).json({
                success: false,
                message: "Title, description, crop type, land area, location, and season are required"
            });
        }

        const newRecord = new AnnaData({
            title,
            description,
            cropType,
            landArea,
            location,
            season,
            yieldExpected,
            actualYield,
            costInvested,
            revenue,
            notes,
            status,
            plantingDate,
            harvestDate,
            author: req.user._id
        });

        await newRecord.save();
        await newRecord.populate('author', 'username location');

        res.status(201).json({
            success: true,
            data: newRecord,
            message: "AnnaData record created successfully"
        });
    } catch (err) {
        console.error("Error creating annadata record:", err);
        res.status(500).json({
            success: false,
            message: "Error creating annadata record",
            error: err.message
        });
    }
};

// PUT /api/annadata/:id - Update an annadata record
module.exports.updateRecord = async (req, res) => {
    try {
        const record = await AnnaData.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "AnnaData record not found"
            });
        }

        // Check if user is the author
        if (record.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this record"
            });
        }

        const {
            title,
            description,
            cropType,
            landArea,
            location,
            season,
            yieldExpected,
            actualYield,
            costInvested,
            revenue,
            notes,
            status,
            plantingDate,
            harvestDate
        } = req.body;

        // Update fields if provided
        if (title) record.title = title;
        if (description) record.description = description;
        if (cropType) record.cropType = cropType;
        if (landArea) record.landArea = landArea;
        if (location) record.location = location;
        if (season) record.season = season;
        if (yieldExpected !== undefined) record.yieldExpected = yieldExpected;
        if (actualYield !== undefined) record.actualYield = actualYield;
        if (costInvested !== undefined) record.costInvested = costInvested;
        if (revenue !== undefined) record.revenue = revenue;
        if (notes !== undefined) record.notes = notes;
        if (status) record.status = status;
        if (plantingDate) record.plantingDate = plantingDate;
        if (harvestDate) record.harvestDate = harvestDate;

        await record.save();
        await record.populate('author', 'username location');

        res.json({
            success: true,
            data: record,
            message: "AnnaData record updated successfully"
        });
    } catch (err) {
        console.error("Error updating annadata record:", err);
        res.status(500).json({
            success: false,
            message: "Error updating annadata record",
            error: err.message
        });
    }
};

// DELETE /api/annadata/:id - Delete an annadata record
module.exports.deleteRecord = async (req, res) => {
    try {
        const record = await AnnaData.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "AnnaData record not found"
            });
        }

        // Check if user is the author
        if (record.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this record"
            });
        }

        await AnnaData.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "AnnaData record deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting annadata record:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting annadata record",
            error: err.message
        });
    }
};

// GET /api/annadata/search - Search annadata records
module.exports.searchRecords = async (req, res) => {
    try {
        const { q, cropType, season, status } = req.query;
        const query = {};

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } }
            ];
        }

        if (cropType) query.cropType = cropType;
        if (season) query.season = season;
        if (status) query.status = status;

        const records = await AnnaData.find(query)
            .populate('author', 'username location')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: records,
            message: "Search results retrieved successfully"
        });
    } catch (err) {
        console.error("Error searching annadata records:", err);
        res.status(500).json({
            success: false,
            message: "Error searching annadata records",
            error: err.message
        });
    }
};

// GET /api/annadata/statistics - Get annadata statistics
module.exports.getStatistics = async (req, res) => {
    try {
        const totalRecords = await AnnaData.countDocuments();
        const userRecords = await AnnaData.countDocuments({ author: req.user._id });
        
        const cropStats = await AnnaData.aggregate([
            { $group: { _id: "$cropType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const seasonStats = await AnnaData.aggregate([
            { $group: { _id: "$season", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const statusStats = await AnnaData.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                total: totalRecords,
                userTotal: userRecords,
                cropTypes: cropStats,
                seasons: seasonStats,
                statuses: statusStats
            },
            message: "Statistics retrieved successfully"
        });
    } catch (err) {
        console.error("Error fetching statistics:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: err.message
        });
    }
};

// GET /api/annadata/options - Get available options for dropdowns
module.exports.getOptions = async (req, res) => {
    try {
        const options = {
            cropTypes: ['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Potato', 'Tomato', 'Onion', 'Other'],
            seasons: ['Kharif', 'Rabi', 'Zaid'],
            statuses: ['Planning', 'In Progress', 'Harvested', 'Sold']
        };

        res.json({
            success: true,
            data: options,
            message: "Options retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching options",
            error: err.message
        });
    }
};
