import Payment from '../models/paymentModel.js';
import Contest from '../models/contestModel.js';

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

        if (!resp) {
            return res.status(400).send({
                success: "false",
                message: "Payment save failed",
                data: null
            })
        }

        const getContest = await Contest.findOne({ contestName: contestName, isDeleted: false })

        if(!getContest) {
            return res.status(404).send({
                success: "false",
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
            return res.status(400).send({
                success: "false",
                message: "quantity not updated!",
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
        return res.status(500).send({
            message: error.message,
            success: false,
            error: error
        });
    }
};


export const savePaymentBuy = async (req, res) => {
    try {
        console.log("payment buy started ------------------------")
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
        return res.status(500).send({
            message: error.message,
            success: false,
            error: error
        });
    }
};


export const getPaymentStatus = async (req, res) => {
    try {


    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
}
