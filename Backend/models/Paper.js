const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({

    paperName: {
        type: String,
        required: true
    },

    semester: {
        type: String,
        required: true
    },

    pdfFile: {
        type: String,
        required: true
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

module.exports = mongoose.model("Paper", paperSchema);