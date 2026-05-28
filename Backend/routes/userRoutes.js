const express = require("express");

const User =
    require("../models/User");

const Query =
    require("../models/Query");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const router =
    express.Router();


// =========================
// PROTECTED ADMIN
// =========================

const PROTECTED_ADMIN =
    "singhompal3313@gmail.com";


// =========================
// GET ALL USERS
// =========================

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

        } catch (error) {

            res.status(500).json({

                error:
                    error.message

            });

        }

    }

);


// =========================
// CHANGE ROLE
// =========================

router.put(

    "/role/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                );

            // USER NOT FOUND

            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }

            // PROTECTED ADMIN

            if (user.email === PROTECTED_ADMIN) {

                return res.status(403).json({

                    message:
                        "This admin role cannot be changed"

                });

            }

            // UPDATE ROLE

            user.role =
                req.body.role;

            await user.save();

            res.status(200).json({

                message:
                    "Role updated successfully",

                updatedUser:
                    user

            });

        } catch (error) {

            res.status(500).json({

                error:
                    error.message

            });

        }

    }

);


// =========================
// DELETE USER + RELATED DATA
// =========================

router.delete(

    "/delete/:id",

    authMiddleware,
    adminMiddleware,

    async (req, res) => {

        try {

            const userId =
                req.params.id;

            const user =
                await User.findById(
                    userId
                );

            // USER NOT FOUND

            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }

            // PROTECTED ADMIN

            if (user.email === PROTECTED_ADMIN) {

                return res.status(403).json({

                    message:
                        "This admin cannot be deleted"

                });

            }

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

        } catch (error) {

            res.status(500).json({

                error:
                    error.message

            });

        }

    }

);

module.exports = router;