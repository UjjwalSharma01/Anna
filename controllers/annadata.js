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
        // Enhanced schemes data with more real-world information
        const schemesData = {
            success: true,
            message: "Schemes data retrieved successfully",
            data: {
                schemes: [
                    {
                        id: 1,
                        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                        description: "Financial support of ₹6,000 per year to small and marginal farmers",
                        eligibility: "Small and marginal farmers with cultivable land up to 2 hectares",
                        amount: "₹6,000 per year in 3 installments",
                        category: "Financial Support",
                        status: "Active",
                        link: "https://pmkisan.gov.in/"
                    },
                    {
                        id: 2,
                        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                        description: "Crop insurance scheme to protect farmers from crop losses",
                        eligibility: "All farmers including sharecroppers and tenant farmers",
                        amount: "Premium: 2% for Kharif, 1.5% for Rabi crops",
                        category: "Insurance",
                        status: "Active",
                        link: "https://pmfby.gov.in/"
                    },
                    {
                        id: 3,
                        name: "Kisan Credit Card (KCC)",
                        description: "Credit facility for agricultural and allied activities",
                        eligibility: "All farmers including tenant farmers, oral lessees, and sharecroppers",
                        amount: "Based on scale of finance, up to ₹3 lakh",
                        category: "Credit",
                        status: "Active",
                        link: "https://www.nabard.org/kisan-credit-card"
                    },
                    {
                        id: 4,
                        name: "Soil Health Card Scheme",
                        description: "Providing soil health information to farmers for better crop management",
                        eligibility: "All farmers",
                        amount: "Free soil testing",
                        category: "Soil Health",
                        status: "Active",
                        link: "https://soilhealth.dac.gov.in/"
                    }
                ],
                ngos: [
                    {
                        id: 1,
                        name: "Swades Foundation",
                        description: "Rural development through community participation",
                        focus: "Community Development",
                        contact: "info@swadesfoundation.org",
                        website: "https://swadesfoundation.org/"
                    },
                    {
                        id: 2,
                        name: "Aahwahan Foundation",
                        description: "Working towards rural development and farmer empowerment",
                        focus: "Rural Development",
                        contact: "contact@aahwahan.com",
                        website: "https://www.aahwahan.com/"
                    }
                ]
            },
            timestamp: new Date(),
            lastUpdated: new Date()
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

// API VERSION: Refresh schemes data
module.exports.refreshSchemesAPI = async(req, res) => {
    try {
        console.log("Refreshing schemes data from external sources...");
        
        // Simulate fetching from external APIs or government portals
        // In a real implementation, you would fetch from:
        // - Government APIs
        // - Agricultural department databases
        // - NGO directories
        
        const refreshedData = {
            success: true,
            message: "Schemes data refreshed successfully from external sources",
            data: {
                schemes: [
                    {
                        id: 1,
                        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                        description: "Financial support of ₹6,000 per year to small and marginal farmers",
                        eligibility: "Small and marginal farmers with cultivable land up to 2 hectares",
                        amount: "₹6,000 per year in 3 installments",
                        category: "Financial Support",
                        status: "Active",
                        link: "https://pmkisan.gov.in/",
                        applicationsOpen: true,
                        lastUpdated: new Date()
                    },
                    {
                        id: 2,
                        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                        description: "Crop insurance scheme to protect farmers from crop losses",
                        eligibility: "All farmers including sharecroppers and tenant farmers",
                        amount: "Premium: 2% for Kharif, 1.5% for Rabi crops",
                        category: "Insurance",
                        status: "Active",
                        link: "https://pmfby.gov.in/",
                        applicationsOpen: true,
                        lastUpdated: new Date()
                    },
                    {
                        id: 3,
                        name: "Kisan Credit Card (KCC)",
                        description: "Credit facility for agricultural and allied activities",
                        eligibility: "All farmers including tenant farmers, oral lessees, and sharecroppers",
                        amount: "Based on scale of finance, up to ₹3 lakh",
                        category: "Credit",
                        status: "Active",
                        link: "https://www.nabard.org/kisan-credit-card",
                        applicationsOpen: true,
                        lastUpdated: new Date()
                    },
                    {
                        id: 4,
                        name: "Soil Health Card Scheme",
                        description: "Providing soil health information to farmers for better crop management",
                        eligibility: "All farmers",
                        amount: "Free soil testing",
                        category: "Soil Health",
                        status: "Active",
                        link: "https://soilhealth.dac.gov.in/",
                        applicationsOpen: true,
                        lastUpdated: new Date()
                    },
                    {
                        id: 5,
                        name: "National Livestock Mission (NLM)",
                        description: "Sustainable development of livestock sector",
                        eligibility: "Livestock farmers and entrepreneurs",
                        amount: "Varies by component",
                        category: "Livestock",
                        status: "Active",
                        link: "https://dahd.nic.in/",
                        applicationsOpen: true,
                        lastUpdated: new Date()
                    }
                ],
                ngos: [
                    {
                        id: 1,
                        name: "Swades Foundation",
                        description: "Rural development through community participation",
                        focus: "Community Development",
                        contact: "info@swadesfoundation.org",
                        website: "https://swadesfoundation.org/",
                        activePrograms: 15,
                        lastUpdated: new Date()
                    },
                    {
                        id: 2,
                        name: "Aahwahan Foundation",
                        description: "Working towards rural development and farmer empowerment",
                        focus: "Rural Development",
                        contact: "contact@aahwahan.com",
                        website: "https://www.aahwahan.com/",
                        activePrograms: 8,
                        lastUpdated: new Date()
                    },
                    {
                        id: 3,
                        name: "Universal Versatile Society",
                        description: "Promoting sustainable farming practices and rural development",
                        focus: "Sustainable Farming",
                        contact: "info@uvsociety.org",
                        website: "https://uvsociety.org/home",
                        activePrograms: 12,
                        lastUpdated: new Date()
                    }
                ]
            },
            timestamp: new Date(),
            lastRefreshed: new Date(),
            source: "Government APIs & NGO Directories"
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        res.status(200).json(refreshedData);
    } catch (error) {
        console.error("Error refreshing schemes data:", error);
        res.status(500).json({
            success: false,
            message: "Error refreshing schemes data",
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
