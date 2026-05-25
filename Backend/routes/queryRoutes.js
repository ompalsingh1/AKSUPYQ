const express = require("express");

const router = express.Router();

const Query =
require("../models/Query");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");


// SEND QUERY

router.post(

    "/send",

    authMiddleware,

    async (req, res) => {

        try {

            const newQuery = new Query({

                user: req.user.id,

                message: req.body.message

            });

            await newQuery.save();

            res.status(201).json({

                message:
                "Query submitted successfully"

            });

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }

);


// GET ALL QUERIES

router.get(

    "/all",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const queries = await Query.find()

            .populate("user", "name email");

            res.status(200).json(queries);

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }

);


// DELETE QUERY

router.delete(

    "/delete/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            await Query.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({
                message: "Query deleted"
            });

        } catch(error){

            res.status(500).json({
                error: error.message
            });

        }

    }

);

// MARK QUERY AS SOLVED

router.put(

    "/solve/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            await Query.findByIdAndUpdate(

                req.params.id,

                {

                    isSolved: true

                }

            );

            res.status(200).json({

                message:
                "Query marked as solved"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);

// GET USER'S OWN QUERIES

router.get(

    "/myqueries",

    authMiddleware,

    async (req, res) => {

        try {

            const queries =

            await Query.find({

                user: req.user.id

            })

            .sort({

                isSolved: -1,

                createdAt: -1

            });

            res.status(200).json(
                queries
            );

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);

module.exports = router;