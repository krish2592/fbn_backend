import "dotenv/config";
import { generateTicketId } from '../controllers/generateTickets.js';
import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Transfer from "../models/transferModel.js";
import Upgrade from "../models/upgradeModel.js";
// import logger from "../logger.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const createTicket = async (req, res) => {
    console.log(">>>>>>>>>>>>>>>>>>", req.body)
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
    // const ticket = new Ticket(reqPayload)
    try {
        const result = await Ticket.insertMany(reqPayload)
        // console.log("Bulk insert successful:", result);
    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Ticket Generation Error:", details: error.message });
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

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Finding Contest Error:", details: error.message });
    }
}


export const updateTicket = async (req, res) => {

    const { ticketId, razorpayPaymentId, pricePerQuantity, poolPrize, isActiveBuy, isActiveSell } = req.body


    if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }

    try {
        const updatedTicket = await Ticket.findOneAndUpdate(
            { ticketId: ticketId, isDeleted: false },
            {
                $set: {
                    paymentId: razorpayPaymentId,
                    salePrice: pricePerQuantity,
                    resalePrice: "NA",
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
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};


export const upgradeTicket = async (req, res) => {
    try {

        const { userId, ticketId, razorpayPaymentId, pricePerQuantity, poolPrize, isActiveBuy, isActiveSell } = req.body

        if (!ticketId) {
            return res.status(400).json({ error: "Ticket ID is required" });
        }

        const getTicket = await Ticket.findOne({ ticketId: ticketId, isDeleted: false, onSell: false })
            .select({ userId: 1, paymentId: 1 });

        if (!getTicket) {
            return res.status(404).send({ success: false, message: "Ticket not found!", id: null });
        }

        const upgradePayload = {
            ticketId: ticketId,
            userId: userId,
            newpaymentId: razorpayPaymentId,
            oldPaymentId: getTicket.paymentId
        }

        const upgrade = new Upgrade(upgradePayload);
        const upgradeResp = await upgrade.save()

        if (!upgradeResp) {
            return res.status(400).send({ success: false, message: "Transfer is not created!", id: null });
        }


        const upgradeTicket = await Ticket.findOneAndUpdate(
            { ticketId: ticketId, isDeleted: false, onSell: false },
            {
                $set: {
                    userId: userId,
                    paymentId: razorpayPaymentId,
                    salePrice: pricePerQuantity,
                    resalePrice: "NA",   // resalePrice: 2 * pricePerQuantity,
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

        return res.status(200).send({ success: true, message: "upgrade success!", data: ticketId });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Ticket upgradation failed!", details: error.message });
    }
};



export const transferTicket = async (req, res) => {

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
                    resalePrice: "NA",
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
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Ticket transfer failed!", details: error.message });
    }
};


export const searchTicket = async (req, res) => {

    try {

        const query = req.query.query;

        if (!query) {
            console.log(`${moduleName}: No query found`);
            return res.status(400).send({ success: false, message: "Please enter email or ticket id", data: [] });
        }

        if (query.includes("@") && query.includes(".")) {
            const getUser = await User.findOne({ email: query.trim().toLowerCase(), isDeleted: false }).select({ userId: 1 })

            if (!getUser) {
                console.log(`${moduleName}: User not found`);
                return res.status(404).send({ success: false, message: "User does not exist!", data: [] });
            }

            const getTickets = await Ticket.find({ userId: getUser.userId, isDeleted: false, onSell: true })
                .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

            if (getTickets.length == 0) {
                console.log(`${moduleName}: No tickets to sell`);
                return res.status(400).send({ success: false, message: "No tickets to sell", data: null });
            }

            return res.status(200).send({ success: true, message: "fetched success!", data: getTickets });

        } else {
            const getTicket = await Ticket.find({ ticketId: query.trim(), isDeleted: false, onSell: true })
                .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

            if (getTicket.length == 0) {
                console.log(`${moduleName}: Items not found!`);
                return res.status(404).send({ success: false, message: "Items not found!", data: [] });
            }

            return res.status(200).send({ success: true, message: "fetched success!", data: getTicket });
        }
    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Searching Ticket failed", details: error.message });
    }
}


export const getTicket = async (req, res) => {

    try {

        const query = req.query.query;

        if (!query) {
            console.log(`${moduleName}: No query found`);
            return res.status(400).send({ success: false, message: "Please enter email or ticket id", data: [] });
        }

        const getTickets = await Ticket.findOne({ ticketId: query.trim(), isDeleted: false })
            .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

        if (!getTickets) {
            console.log(`${moduleName}: No tickets found`);
            return res.status(400).send({ success: false, message: "No ticket found", data: null });
        }

        return res.status(200).send({ success: true, message: "fetched success!", onSell: getTickets.onSell });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Fetching Ticket failed", details: error.message });
    }
}



export const activateTicket = async (req, res) => {

    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required!", id: null });
        }

        const updateTicket = await Ticket.findOneAndUpdate(
            { ticketId: query.trim() },
            { onSell: true },
            { returnDocument: "after" })
            .select({ ticketId: 1, onSell: 1 })

        if (!updateTicket) {
            return res.status(400).json({ success: false, message: "No ticket found!", id: null });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket activated successfully!",
            onSell: updateTicket.onSell
        });
    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Ticket activation failed", details: error.message });
    }

}

export const deactivateTicket = async (req, res) => {

    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required!", id: null });
        }

        const updateTicket = await Ticket.findOneAndUpdate(
            { ticketId: query.trim() },
            { onSell: false },
            { returnDocument: "after" })
            .select({ ticketId: 1, onSell: 1 })

        if (!updateTicket) {
            return res.status(400).json({ success: false, message: "No ticket found!", id: null });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket deactivated successfully!",
            onSell: updateTicket.onSell
        });
    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Ticket deactivation failed", details: error.message });
    }
}

export const getAllTicketByContestName = async (req, res) => {
    try {

        console.log("hhhh", req.body);
        const { id, contestId } = req.body;


        if (!id && !contestId) {
            console.log(`${moduleName}: contest not found`);
            return res.status(400).send({ success: false, message: "Please select contest", data: [] });
        }

        const getTickets = await Ticket.find({ userId: id.trim(), contestName: contestId.trim(), isDeleted: false })
            .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

        console.log(getTickets)
        if (!getTickets.length) {
            console.log(`${moduleName}: No contest ticket found`);
            return res.status(200).send({ success: true, message: "No contest ticket found", data: [{ ticketId: "No Ticket" }] });
        }

        return res.status(200).send({ success: true, message: "fetched contest ticket success!", data: getTickets });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Fetching contest failed", details: error.message });
    }
}



export const validateTicket = async (req, res) => {
    try {

        const { ticketId, contestId } = req.body;

        if (!ticketId && !contestId) {
            return res.status(400).send({ success: false, message: "ticketId and contestId both are required", isValid: false });
        }

        const getTickets = await Ticket.findOne({ ticketId: ticketId.trim(), contestName: contestId.trim(), isDeleted: false })
            .select({ _id: 0, paymentId: 0, isDeleted: 0, updatedAt: 0, __v: 0 })

        if (!getTickets) {
            console.log(`${moduleName}: No contest ticket found`);
            return res.status(400).send({ success: false, message: "No contest ticket found", isValid: false });
        }

        return res.status(200).send({ success: true, message: "fetched contest ticket success!", isValid: true });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ error: "Validating contest failed", details: error.message });
    }
}








