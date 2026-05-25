const mongoose = require("mongoose");

const querySchema =
new mongoose.Schema({

    user: {

        type:
        mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    message: {

        type: String,

        required: true

    },

    isSolved: {

    type: Boolean,

    default: false

}

}, { timestamps: true });

module.exports =
mongoose.model("Query", querySchema);