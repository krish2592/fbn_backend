import { console } from "inspector";
import UserResponse from "../models/userResponseModel.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const saveUserPaperResponse = async (req, res) => {

    try {

        const { contestName, ticketId, userId, data } = req.body;

        const updateQuery = {
            $setOnInsert: {
                userId,
                contestName,
                ticketId
            },
            $set: {}
        }

        if (Array.isArray(data) && data.length > 0) {
            updateQuery.$set.paperResponse = data
                .filter(
                    item => item.questionId
                ).map(item => {
                    return Object.fromEntries(
                        Object.entries(item).filter(([key, value]) => value != null)
                    );
                })
        }

        console.log(updateQuery)

        const isSubmitted = await UserResponse.findOne({ contestName: contestName, ticketId: ticketId, isDeleted: false, isSubmitted: true })

        if (isSubmitted) {
            return res.status(200).json({ message: "already submitted", success: true });
        }

        const response = await UserResponse.updateOne(
            { contestName: contestName, ticketId: ticketId, isDeleted: false, isSubmitted: false },
            updateQuery,
            { upsert: true, new: true }
        )

        if (response) {
            console.log({ response: response })
            return res.status(200).json({ message: "success", success: true });
        }

        return res.status(404).json({ message: "no response", success: false });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ message: "Server error", error });
    }

}

export const submitUserPaperResponse = async (req, res) => {

    try {

        const { contestName, ticketId, userId, data } = req.body;

        const updateQuery = {
            $setOnInsert: {
                userId,
                contestName,
                ticketId
            },
            $set: {}
        }

        if (Array.isArray(data) && data.length > 0) {
            updateQuery.$set.paperResponse = data
                .filter(
                    item => item.questionId
                ).map(item => {
                    return Object.fromEntries(
                        Object.entries(item).filter(([key, value]) => value != null)
                    );
                })
        }

        console.log(updateQuery)

        const response = await UserResponse.findOneAndUpdate(
            { contestName: contestName, ticketId: ticketId, isDeleted: false, isSubmitted: false },
            { updateQuery, isSubmitted: true },
            { new: true }
        )

        if (response) {
            console.log({ response: response })
            return res.status(200).json({ message: "success", success: true });
        }

        return res.status(200).json({ message: "already submitted", success: true });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ message: "Server error", error });
    }

}

export const getUserPaperResponse = async (req, res) => {

    try {

        console.log(`${moduleName}: Get user paper response started`);

        console.log({ reqQuery: req.query })
        const contestName = req.query.q1;
        const ticketId = req.query.q2;
        const userId = req.query.q3;



        const response = await UserResponse.findOne(
            { contestName: contestName, ticketId: ticketId, userId: userId, isDeleted: false }
        )

        console.log(response)
        if (response) {
            const userRespPayload = {
                userId: response.userId,
                contestName: response.contestName,
                ticketId: response.ticketId,
                isSubmitted: response.isSubmitted,
                data: response.paperResponse
            }

            console.log(userRespPayload)
            return res.status(200).send(userRespPayload)

        } else {

            const userRespPayload = {
                userId: userId,
                contestName: contestName,
                ticketId: ticketId,
                isSubmitted: false,
                data: []
            }

            return res.status(200).send(userRespPayload)

        }

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).json({ message: "Server error", error });
    }
}