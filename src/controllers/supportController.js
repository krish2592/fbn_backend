import Support from "../models/supportModel.js";

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
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message, error: err })
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
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message, error: err })
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

        console.log(messagePayload, id, ticketId)

        const getUpdate  = await Support.findOneAndUpdate(
            {userId: id, ticketId: ticketId, isDeleted: false},
            { $push: { messages: messagePayload } }, 
            { new: true } 
        )

        console.log({getUpdate:getUpdate})

        return res.status(200).send({
            status: true,
            message: "Message Added Success"
        })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message, error: err })
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
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message, error: err })
    }
}
