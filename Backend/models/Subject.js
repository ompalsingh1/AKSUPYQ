const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    subjectName: {
        type: String,
        required: true
    },

    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);