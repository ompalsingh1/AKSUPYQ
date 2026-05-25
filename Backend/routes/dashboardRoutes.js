const express = require("express");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");

const Branch = require("../models/Branch");
const Subject = require("../models/Subject");
const Paper = require("../models/Paper");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// USER DASHBOARD

router.get(
    "/user",

    authMiddleware,

    async (req, res) => {

        try {

            const user = await User.findById(req.user.id)

            .select("-password")

            .populate("downloads");

            res.status(200).json(user);

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }
);

// ADMIN DASHBOARD

router.get(

    "/admin",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const totalUsers = await User.countDocuments();

            const totalBranches = await Branch.countDocuments();

            const totalSubjects = await Subject.countDocuments();

            const totalPapers = await Paper.countDocuments();

            // TOTAL DOWNLOADS

            const users = await User.find();

            let totalDownloads = 0;

            users.forEach(user => {

                totalDownloads += user.downloads.length;

            });

            res.status(200).json({

                totalUsers,
                totalBranches,
                totalSubjects,
                totalPapers,
                totalDownloads

            });

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }
);

module.exports = router;