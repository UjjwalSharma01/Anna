const Forum = require("../models/forum")
const User = require("../models/user")

module.exports.index = async(req,res)=>{
    res.render("../views/index.ejs");
};

module.exports.schemes=async(req,res)=>{
    res.render("../views/schemes.ejs")
}

// API VERSION: Schemes endpoint
module.exports.schemesAPI = async(req,res)=>{
    try {
        // For now, return static schemes data
        // Later we can fetch this from database or external API
        const schemesData = {
            success: true,
            message: "Schemes data retrieved successfully",
            data: {
                schemes: [
                    {
                        id: 1,
                        name: "PM-KISAN Scheme",
                        description: "Direct income support to farmers",
                        eligibility: "Small and marginal farmers"
                    },
                    {
                        id: 2, 
                        name: "Crop Insurance Scheme",
                        description: "Insurance coverage for crops",
                        eligibility: "All farmers"
                    }
                ]
            },
            timestamp: new Date()
        };
        
        res.status(200).json(schemesData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving schemes data",
            error: error.message
        });
    }
}

module.exports.renderForums = async (req, res) =>{
    const allPost= await Forum.find({})
    .populate('author')
    res.render("../views/forum.ejs",{allPost})
}
module.exports.profile=async(req,res)=>{
    let user = await User.findById(req.user._id)
    res.render("../views/profile.ejs", {user})
}
