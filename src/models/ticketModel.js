// models/User.js
import mongoose from "mongoose";
import {updateUserPortfolio} from "../controllers/portfolioController.js";

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        paymentId:{
            type: Object,
            required: true,
        },
        ticketId: {
            type: String,
            required: true,
            unique: true
        },
        contestName: {
            type: String,
            required: true,
        },
        salePrice: {
            type: String,
            required: true,
        },
        resalePrice: {
            type: String,
            default: "NA"
        },
        poolPrize: {
            type: String,
            required: true,
        },
        isActiveBuy: {
            type: Boolean,
            default: false
        },
        isActiveSell: {
            type: Boolean,
            default: false
        },
        onSell: {
            type:Boolean,
            default: false
        },
        paymentType: {
            type: String,
            default: "complete"
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


// ✅ Auto-update stats when document is created
ticketSchema.post("save", async function (doc, next) {
    console.log("✅ Investment added, updating stats...");
    await updateUserPortfolio(doc.userId);
    next();
});

ticketSchema.post("insertMany", async function (docs, next) {
    console.log("📌 [HOOK] insertMany triggered");

    const userIds = [...new Set(docs.map(doc => doc.userId))]; // Get unique user IDs
    await Promise.all(userIds.map(userId => updateUserPortfolio(userId))); // Update stats for each user

    console.log("✅ Stats updated after insertMany");
    next();
});

ticketSchema.pre("findOneAndUpdate", async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery()); // Get the old document
    this._oldUserId = docToUpdate?.userId; // Store old userId for later
    next();
});

ticketSchema.post("findOneAndUpdate", async function (doc, next) {
    if (!doc) return next();

    console.log("🟡 [HOOK] Investment transferred. Updating stats...");

    const newUserId = doc.userId;
    const oldUserId = this._oldUserId;

    // Update stats for both old and new users
    if (oldUserId) await updateUserPortfolio(oldUserId);
    if (newUserId) await updateUserPortfolio(newUserId);

    console.log("✅ Stats updated for old user:", oldUserId, "and new user:", newUserId);
    next();
});

// ✅ Auto-update stats when document is deleted
ticketSchema.post("findOneAndDelete", async function (doc, next) {
    if (doc) {
        console.log("✅ Investment deleted, updating stats...");
        await updateUserPortfolio(doc.userId);
    }
    next();
});

// ✅ Auto-update stats when multiple documents are deleted
ticketSchema.post("deleteMany", async function (result, next) {
    console.log("✅ Multiple investments deleted, updating stats...");
    if (result.deletedCount > 0) {
        await updateUserPortfolio(result.userId);
    }
    next();
});


const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
