import "dotenv/config";
import Payment from '../models/paymentModel.js';
import { generateTicketId } from '../controllers/generateTickets.js';
import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Transfer from "../models/transferModel.js";
import Upgrade from "../models/upgradeModel.js";

// async function watchChanges() {

//     try {
//         const changeStream = Payment.watch()
//         console.log("Watching for changes...");

//         // Listen for changes
//         changeStream.on("change", async (change) => {
//             console.log("Change detected:", change);

//             // Check if the status was updated to "pending"
//             if (
//                 change.operationType === "update" &&
//                 change.updateDescription &&
//                 change.updateDescription.updatedFields["ticketStatus"] === "Pending"
//             ) {
//                 const documentId = change.documentKey._id;

//                 try {
//                     // Retrieve the full document from the 'pay' collection
//                     const payDocument = await Payment.findById(documentId);

//                     if (payDocument) {
//                         // Insert data into the 'tpay' collection
//                         const tpayData = {
//                             payId: payDocument._id,
//                             amount: payDocument.amount,
//                         };

//                         await TPay.create(tpayData);
//                         console.log("Inserted into TPay:", tpayData);

//                         // Update the status in the 'pay' collection to "created"
//                         await Pay.findByIdAndUpdate(documentId, { status: "created" });
//                         console.log("Status updated to 'created' for document:", documentId);
//                     }
//                 } catch (error) {
//                     console.error("Error processing change:", error);
//                 }
//             }
//         });

//         // Handle errors
//         changeStream.on("error", (error) => {
//             console.error("Change stream error:", error);
//             watchChanges(); // Restart the watcher on error
//         });
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// }

// watchChanges();


export const createTicket = async (req, res) => {

    console.log("ZZZZZZZZZZZZZZZZ", req.body);

    const {
        userId,
        razorpayPaymentId,
        contestName,
        amount,
        poolPrize,
        quantity,
        pricePerQuantity,
        isActiveBuy,
        isActiveSell
    } = req.body;

    const tickets = [];

    for (let i = 0; i < quantity; i++) {
        tickets.push(generateTicketId());
    }

    // console.log(tickets);

    const reqPayload = []

    for (let i = 0; i < tickets.length; i++) {
        const payload = {}
        payload["userId"] = userId;
        payload["paymentId"] = razorpayPaymentId;
        payload["ticketId"] = tickets[i];
        payload["contestName"] = contestName;
        payload["salePrice"] = pricePerQuantity;
        payload["resalePrice"] = 2 * pricePerQuantity;
        payload["poolPrize"] = poolPrize
        payload["isActiveBuy"] = isActiveBuy
        payload["isActiveSell"] = isActiveSell
        reqPayload.push(payload)
    }
    console.log("ggg", reqPayload);
    // const ticket = new Ticket(reqPayload)
    try {
        const result = await Ticket.insertMany(reqPayload)
        // console.log("Bulk insert successful:", result);
    } catch (err) {
        console.error("Bulk insert failed:", err);
    }

}



export const getMyContest = async (req, res) => {
    try {

        console.log("Get contest for user: ", req.query.userId)
        const userId = req.query.userId

        const result = await Ticket.find({ userId: userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .select({ _id: 0, paymentId: 0, updatedAt: 0, __v: 0, isDeleted: 0 })

        console.log(result);

        res.send({ success: true, message: "Contest Ticket Fetched Success!", data: result })

    } catch (err) {
        console.error("Finding Contest Error: ", err);
    }
}


export const updateTicket = async (req, res) => {

    console.log("updated ticket started  -----------------")

    const { ticketId, razorpayPaymentId, pricePerQuantity, poolPrize, isActiveBuy, isActiveSell } = req.body


    if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }


    console.log({ "ticketId": ticketId })

    try {
        const updatedTicket = await Ticket.findOneAndUpdate(
            { ticketId: ticketId, isDeleted: false },
            {
                $set: {
                    paymentId: razorpayPaymentId,
                    salePrice: pricePerQuantity,
                    resalePrice: 2 * pricePerQuantity,
                    poolPrize: poolPrize,
                    isActiveBuy: isActiveBuy,
                    isActiveSell: isActiveSell
                }
            },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ error: "Ticket not found" });
        }


        const resPayload = {
            success: true,
            message: "Updated Ticket Successfully!",
            id: ticketId
        }

        res.json(resPayload);
    } catch (error) {
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};


export const upgradeTicket = async (req, res) => {
    try {

        console.log("upgrade ticket")

        const { userId, ticketId, razorpayPaymentId, pricePerQuantity, poolPrize, isActiveBuy, isActiveSell } = req.body

        console.log("upgrade ticket request", userId, ticketId, razorpayPaymentId, pricePerQuantity, poolPrize, isActiveBuy, isActiveSell)

        if (!ticketId) {
            return res.status(400).json({ error: "Ticket ID is required" });
        }

        const getTicket = await Ticket.findOne({ ticketId: ticketId, isDeleted: false, onSell: false })
            .select({ userId: 1, paymentId: 1 });

        if (!getTicket) {
            return res.status(404).send({ success: false, message: "Ticket not found!", id: null });
        }

        console.log({ getTicket: getTicket })

        const upgradePayload = {
            ticketId: ticketId,
            userId: userId,
            newpaymentId: razorpayPaymentId,
            oldPaymentId: getTicket.paymentId
        }

        console.log({ upgradePayload: upgradePayload })

        const upgrade = new Upgrade(upgradePayload);
        const upgradeResp = await upgrade.save()

        if (!upgradeResp) {
            return res.status(400).send({ success: false, message: "Transfer is not created!", id: null });
        }
        console.log({ upgradeResp: upgradeResp })
        const upgradeTicket = await Ticket.findOneAndUpdate(
            { ticketId: ticketId, isDeleted: false, onSell: false },
            {
                $set: {
                    userId: userId,
                    paymentId: razorpayPaymentId,
                    salePrice: pricePerQuantity,
                    resalePrice: 2 * pricePerQuantity,
                    poolPrize: poolPrize,
                    isActiveBuy: isActiveBuy,
                    isActiveSell: isActiveSell,
                    onSell: false
                }
            },
            { new: true }
        );

        if (!upgradeTicket) {
            return res.status(404).send({ success: false, message: "Ticket not found!", id: null });
        }

        console.log({ upgradeTicket: upgradeTicket })

        return res.status(200).send({ success: true, message: "upgrade success!", data: ticketId });

    } catch (error) {
        return res.status(500).json({ error: "Ticket upgradation failed!", details: error.message });
    }
};



export const transferTicket = async (req, res) => {

    console.log("transfer ticket started  -----------------")

    const { userId, ticketId, razorpayPaymentId, pricePerQuantity, poolPrize, isActiveBuy, isActiveSell } = req.body

    if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }

    try {

        const getTicket = await Ticket.findOne({ ticketId: ticketId, isDeleted: false, onSell: true })
            .select({ userId: 1, paymentId: 1 });

        if (!getTicket) {
            return res.status(404).send({ success: false, message: "Ticket not found!", id: null });
        }

        const transferPayload = {
            ticketId: ticketId,
            transferee: userId,
            newpaymentId: razorpayPaymentId,
            transferor: getTicket.userId,
            oldPaymentId: getTicket.paymentId,
            transferAmount: pricePerQuantity,
            isTransfer: true,
            isAmountTransfered: false
        }

        const transfer = new Transfer(transferPayload);
        const transferResp = await transfer.save()

        if (!transferResp) {
            return res.status(400).send({ success: false, message: "Transfer is not created!", id: null });
        }

        const transferTicket = await Ticket.findOneAndUpdate(
            { ticketId: ticketId, isDeleted: false, onSell: true },
            {
                $set: {
                    userId: userId,
                    paymentId: razorpayPaymentId,
                    salePrice: pricePerQuantity,
                    resalePrice: 2 * pricePerQuantity,
                    poolPrize: poolPrize,
                    isActiveBuy: isActiveBuy,
                    isActiveSell: isActiveSell,
                    onSell: false
                }
            },
            { new: true }
        );

        if (!transferTicket) {
            return res.status(404).send({ success: false, message: "Ticket not found!", id: null });
        }

        return res.status(200).send({ success: true, message: "transfer success!", data: ticketId });

    } catch (error) {
        return res.status(500).json({ error: "Ticket transfer failed!", details: error.message });
    }
};


export const searchTicket = async (req, res) => {

    const query = req.query.query;

    console.log(query)

    if (!query) {
        return res.status(400).send({ success: false, message: "Please enter email or ticket id", data: [] });
    }

    if (query.includes("@") && query.includes(".")) {
        const getUser = await User.findOne({ email: query.trim().toLowerCase(), isDeleted: false }).select({ userId: 1 })
        console.log({getUser: getUser})
        
        if (!getUser) {
            return res.status(404).send({ success: false, message: "User does not exist!", data: [] });
        }
        
        const getTickets = await Ticket.find({ userId: getUser.userId, isDeleted: false, onSell: true })
            .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

        if (getTickets.length == 0) {
            return res.status(400).send({ success: false, message: "No tickets to sell", data: null });
        }

        return res.status(200).send({ success: true, message: "fetched success!", data: getTickets });

    } else {
        const getTicket = await Ticket.find({ ticketId: query.trim(), isDeleted: false, onSell: true })
            .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

        console.log({ getTicket: getTicket })
        if (getTicket.length == 0) {
            return res.status(404).send({ success: false, message: "Items not found!", data: [] });
        }

        console.log({ getUser: query.trim() })
        return res.status(200).send({ success: true, message: "fetched success!", data: getTicket });
    }
}


export const activateTicket = async (req, res) => {

    try {
        const query = req.query.query;
        console.log(query)
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required!", id: null });
        }

        const updateTicket = await Ticket.updateOne({ ticketId: query.trim() }, { onSell: true }).select({ ticketId: 1 })

        if (!updateTicket) {
            return res.status(400).json({ success: false, message: "No ticket found!", id: null });
        }

        return res.status(200).json({ success: true, message: "Ticket activated successfully!", id: updateTicket.ticketId });
    } catch (error) {
        return res.status(500).json({ error: "Ticket activation failed", details: error.message });
    }

}

export const deactivateTicket = async (req, res) => {

    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required!", id: null });
        }

        const updateTicket = await Ticket.updateOne({ ticketId: query.trim() }, { onSell: false }).select({ ticketId: 1 })

        if (!updateTicket) {
            return res.status(400).json({ success: false, message: "No ticket found!", id: null });
        }

        return res.status(200).json({ success: true, message: "Ticket deactivated successfully!", id: updateTicket.ticketId });
    } catch (error) {
        return res.status(500).json({ error: "Ticket deactivation failed", details: error.message });
    }
}













