import Payment from '../models/paymentModel.js';
import Contest from '../models/contestModel.js';
// import logger from '../logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

// Payment endpoint to handle payment creation
export const savePayment = async (req, res) => {
    try {

        const { userId, razorpayPaymentId, contestName,
            amount, quantity, pricePerQuantity, poolPrize, 
            email, number, status, description } = req.body;

        const payment = new Payment({
            userId,
            razorpayPaymentId,
            contestName,
            amount,
            quantity,
            pricePerQuantity,
            poolPrize,
            email,
            phone: number,
            status,
            description
        }
        )

        const resp = await payment.save(payment);
        console.log("payment-response", resp)
        if (!resp) {
            console.log(`${moduleName}: Message: Payment save failed`);
            return res.status(400).send({
                success: "false",
                message: "Payment save failed",
                data: null
            })
        }

        const getContest = await Contest.findOne({ contestName: contestName, isDeleted: false })

        if(!getContest) {
            console.log(`${moduleName}: Message: Contest not found!`);
            return res.status(404).send({
                success: false,
                message: "Contest not found!",
                data: null
            })
        }

        const newQuantitySold = Number(getContest.quantitySold) + Number(quantity);

        const updateQuantitySold = await Contest.updateOne(
            { contestName: contestName, isDeleted: false },
            {
                $set: {
                    quantitySold: newQuantitySold,
                }
            },
            { new: true }
        )

        if(!updateQuantitySold) {
            console.log(`${moduleName}: Message: quantity not updated!`);
            return res.status(400).send({
                success: false,
                message: "quantity not updated!",
                data: null
            })
        }

        const respPayload = {
            success: true,
            message: "Payment saved successfully",
            data: {
                id: resp._id,
                amount: resp.amount
            }
        };
       
        console.log(respPayload)
        return res.status(200).send(respPayload)

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({
            message: error.message,
            success: false,
            error: error
        });
    }
};


export const savePaymentBuy = async (req, res) => {
    try {

        const { userId, razorpayPaymentId, contestName,
            amount, quantity, pricePerQuantity, poolPrize, 
            email, number, status, description } = req.body;

        const payment = new Payment({
            userId,
            razorpayPaymentId,
            contestName,
            amount,
            quantity,
            pricePerQuantity,
            poolPrize,
            email,
            phone: number,
            status,
            description
        }
        )

        const resp = await payment.save(payment);

        if (!resp) {
            return res.status(400).send({
                success: "false",
                message: "Payment save failed",
                data: null
            })
        }

        res.send({
            success: "success",
            message: "Payment saved successfully",
            data: {
                id: resp._id,
                amount: resp.amount
            }
        })

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({
            message: error.message,
            success: false,
            error: error
        });
    }
};


export const savePaymentSell = async (req, res) => {
    try {

        const { userId, razorpayPaymentId, contestName,
            amount, quantity, pricePerQuantity, poolPrize, 
            email, number, status, description } = req.body;

        const payment = new Payment({
            userId,
            razorpayPaymentId,
            contestName,
            amount,
            quantity,
            pricePerQuantity,
            poolPrize,
            email,
            phone: number,
            status,
            description
        }
        )

        const resp = await payment.save(payment);

        if (!resp) {
            return res.status(400).send({
                success: "false",
                message: "Payment save failed",
                data: null
            })
        }

        res.send({
            success: "success",
            message: "Payment saved successfully",
            data: {
                id: resp._id,
                amount: resp.amount
            }
        })

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        return res.status(500).send({
            message: error.message,
            success: false,
            error: error
        });
    }
};


