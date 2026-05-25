const express = require("express");

const Branch = require("../models/Branch");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ADD BRANCH

router.post(
    "/add",
    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const { branchName } = req.body;

            const existingBranch = await Branch.findOne({ branchName });

            if(existingBranch){

                return res.status(400).json({
                    message: "Branch already exists"
                });

            }

            const newBranch = new Branch({
                branchName
            });

            await newBranch.save();

            res.status(201).json({
                message: "Branch added successfully",
                branch: newBranch
            });

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }
);


// GET ALL BRANCHES

router.get("/", async (req, res) => {

    try {

        const branches = await Branch.find();

        res.status(200).json(branches);

    } catch(error){

        res.status(500).json({
            error: error.message
        });

    }

});

// UPDATE BRANCH

router.put(

    "/update/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            await Branch.findByIdAndUpdate(

                req.params.id,

                {

                    branchName:
                    req.body.branchName

                }

            );

            res.status(200).json({

                message:
                "Branch updated"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);



// DELETE BRANCH

router.delete(

    "/delete/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            await Branch.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({

                message:
                "Branch deleted"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);

module.exports = router;