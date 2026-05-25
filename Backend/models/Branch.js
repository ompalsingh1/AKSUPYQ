const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({

    branchName: {
        type: String,
        required: true,
        unique: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Branch", branchSchema);