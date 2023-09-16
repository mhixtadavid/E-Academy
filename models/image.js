var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema (
    {
        filePath: String,
    },
    {
        timestamps: true,
    },
);


module.exports = mongoose.model("Image", imageSchema, "Image")