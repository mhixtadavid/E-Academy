var mongoose = require("mongoose");
var marked = require("marked");
var slugify = require("slugify");
var createDomPurify = require("dompurify");
var { JSDOM } = require("jsdom");
var dompurify = createDomPurify(new JSDOM().window)


var blogSchema = new mongoose.Schema({
    name: String,
    description: String,
    markdown: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        unique: true,
    },
    sanitizedHtml: {
        type: String,
    }
});

blogSchema.pre("validate", function(next){
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, 
        strict: true})
    }
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model("Blog", blogSchema);