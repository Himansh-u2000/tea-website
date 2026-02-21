import mongoose, { Schema, Types } from "mongoose";

const commentScehma = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 2
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    clap: {
        type: Number,
        min: 0,
    },
    clappedBy: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    reply: {
        type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        min: 0
    }
}, {
    timestamps: true
})

export const Comment = mongoose.model("Comment", commentScehma)