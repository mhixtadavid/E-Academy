const { ObjectId } = require("mongodb");
var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    name: String,
    course: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    tutorial: String,
    price: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Course", courseSchema);