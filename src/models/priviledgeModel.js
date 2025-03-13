import mongoose from "mongoose";

const userPriviledgeSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        accountType: {
            type: String,
            required: true,
            lowercase: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Boolean
        }
    },
    { timestamps: true }
);


const Priviledge = mongoose.model("Priviledge", userPriviledgeSchema);

export default Priviledge;
