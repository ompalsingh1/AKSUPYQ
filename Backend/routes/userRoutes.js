const express = require("express");

const User = require("../models/User");

const Query =
require("../models/Query");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const router = express.Router();


// GET ALL USERS

router.get(

    "/",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const users =
            await User.find()
            .select("-password");

            res.status(200).json(
                users
            );

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);


// CHANGE ROLE

router.put(

    "/role/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const updatedUser =
            await User.findByIdAndUpdate(

                req.params.id,

                {
                    role: req.body.role
                },

                {
                    new: true
                }

            );

            res.status(200).json({

                message:
                "Role updated",

                updatedUser

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);


// DELETE USER + RELATED DATA

router.delete(

    "/delete/:id",

    authMiddleware,

    adminMiddleware,

    async (req, res) => {

        try {

            const userId =
            req.params.id;


            // DELETE USER QUERIES

            await Query.deleteMany({

                user: userId

            });


            // DELETE USER

            await User.findByIdAndDelete(
                userId
            );


            res.status(200).json({

                message:
                "User and related data deleted"

            });

        } catch(error){

            res.status(500).json({

                error: error.message

            });

        }

    }

);

module.exports = router;