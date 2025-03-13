import Support from "../models/supportModel.js";
import logger from '../logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const createSupportTicket = async (req, res) => {

    try {
        const { messages, status, subject, ticketId, userId } = req.body;

        const requestPayload = {
            userId: userId,
            ticketId: ticketId,
            subject: subject,
            status: status,
            messages: messages
        }

        const support = new Support(requestPayload);
        support.save()

        return res.status(200).send({
            status: true,
            messaage: "Ticket created success"
        })
    } catch (error) {
        logger.error(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({ status: false, message: error.message, error: error })
    }
}


export const getUserTickets = async (req, res) => {

    try {
        const { id } = req.query;

        const requestPayload = {
            userId: id,
            isDeleted: false
        }

        const getAllTickets = await Support.find(requestPayload)
        .sort({createdAt: -1})
        .select(
            {
            _id:0, __v:0, 
            createdAt:0, updatedAt:0, isDeleted:0,
        });

        return res.status(200).send({
            status: true,
            message: "Ticket created success",
            data: getAllTickets
        })
    } catch (error) {
        logger.error(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({ status: false, message: error.message, error: error })
    }
}



export const addMessageUser = async (req, res) => {

    try {

        const {id, ticketId }  = req.query;

        const {message, sender, senderId, timestamp} = req.body;

        const messagePayload = {
            senderId: senderId,
            sender: sender || "User",
            message: message,
            timestamp: timestamp
        }

        const getUpdate  = await Support.findOneAndUpdate(
            {userId: id, ticketId: ticketId, isDeleted: false},
            { $push: { messages: messagePayload } }, 
            { new: true } 
        )

        return res.status(200).send({
            status: true,
            message: "Message Added Success"
        })
    } catch (error) {
        logger.error(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({ status: false, message: error.message, error: error })
    }
}



export const addMessageSupport = async (req, res) => {

    try {

        const {id, ticketId }  = req.query;

        const {message, sender, senderId, timestamp} = req.body;

        const messagePayload = {
            senderId: senderId || "",
            sender: sender || "Support",
            message: message || "",
            timestamp: timestamp || ""
        }

        console.log(messagePayload, id, ticketId)

       await Support.findOneAndUpdate(
            {userId: id, ticketId: ticketId, isDeleted: false},
            { $push: { messages: messagePayload } }, 
            { new: true } 
        )

        return res.status(200).send({
            status: true,
            message: "Message Added Success"
        })
    } catch (error) {
         logger.error(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({ status: false, message: error.message, error: error })
    }
}
