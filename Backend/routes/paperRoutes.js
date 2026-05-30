const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Paper = require("../models/Paper");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// MULTER STORAGE

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({ storage });


// UPLOAD PAPER

router.post(
    "/upload",
    authMiddleware,
    adminMiddleware,
    upload.single("pdf"),

    async (req, res) => {

        try {

            const {
                paperName,
                semester,
                subjectId
            } = req.body;

            const newPaper = new Paper({

                paperName,
                semester,

                pdfFile: req.file.path,

                subject: subjectId,

                uploadedBy: req.user.id

            });

            await newPaper.save();

            res.status(201).json({
                message: "Paper uploaded successfully",
                paper: newPaper
            });

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }
);


// GET PAPERS BY SUBJECT

router.get("/:subjectId", async (req, res) => {

    try {

        const papers = await Paper.find({
            subject: req.params.subjectId
        });

        res.status(200).json(papers);

    } catch(error){

        res.status(500).json({
            error: error.message
        });

    }

});

// DOWNLOAD PAPER

router.get(
    "/download/:paperId",

    authMiddleware,

    async (req, res) => {

        try {

            const paper = await Paper.findById(
                req.params.paperId
            );

            if(!paper){

                return res.status(404).json({
                    message: "Paper not found"
                });

            }

            // SAVE DOWNLOAD HISTORY

            await User.findByIdAndUpdate(

                req.user.id,

                {
                    $push: {
                        downloads: paper._id
                    }
                }

            );

            res.download(paper.pdfFile);

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }
);

// EDIT PAPER

router.put(

    "/edit/:paperId",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const {
                paperName,
                semester
            } = req.body;

            const paper =
            await Paper.findByIdAndUpdate(

                req.params.paperId,

                {
                    paperName,
                    semester
                },

                {
                    new: true
                }

            );

            if(!paper){

                return res.status(404).json({

                    message:
                    "Paper not found"

                });

            }

            res.status(200).json({

                message:
                "Paper updated successfully",

                paper

            });

        } catch(error){

            res.status(500).json({

                error:
                error.message

            });

        }

    }

);

// DELETE PAPER

router.delete(

    "/delete/:paperId",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const paper =
            await Paper.findById(
                req.params.paperId
            );

            if(!paper){

                return res.status(404).json({

                    message:
                    "Paper not found"

                });

            }


            // DELETE PDF FILE

            if(fs.existsSync(paper.pdfFile)){

                fs.unlinkSync(
                    paper.pdfFile
                );

            }


            // DELETE DATABASE ENTRY

            await Paper.findByIdAndDelete(
                req.params.paperId
            );


            res.status(200).json({

                message:
                "Paper deleted successfully"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);

module.exports = router;