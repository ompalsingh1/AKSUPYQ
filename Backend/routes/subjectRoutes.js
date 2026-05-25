const express = require("express");

const Subject = require("../models/Subject");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ADD SUBJECT

router.post(
    "/add",
    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const { subjectName, branchId } = req.body;

            const existingSubject = await Subject.findOne({
                subjectName,
                branch: branchId
            });

            if(existingSubject){

                return res.status(400).json({
                    message: "Subject already exists"
                });

            }

            const newSubject = new Subject({
                subjectName,
                branch: branchId
            });

            await newSubject.save();

            res.status(201).json({
                message: "Subject added successfully",
                subject: newSubject
            });

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }
);


// GET SUBJECTS BY BRANCH

router.get("/:branchId", async (req, res) => {

    try {

        const subjects = await Subject.find({
            branch: req.params.branchId
        });

        res.status(200).json(subjects);

    } catch(error){

        res.status(500).json({
            error: error.message
        });

    }

});

// UPDATE SUBJECT

router.put(

    "/update/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            await Subject.findByIdAndUpdate(

                req.params.id,

                {

                    subjectName:
                    req.body.subjectName

                }

            );

            res.status(200).json({

                message:
                "Subject updated"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);



// DELETE SUBJECT

router.delete(

    "/delete/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            await Subject.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({

                message:
                "Subject deleted"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);

module.exports = router;