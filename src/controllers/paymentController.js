import Payment from '../models/paymentModel.js';

// Payment endpoint to handle payment creation
export const savePayment = async (req, res) => {
    try {
       const {userId, razorpayPaymentId, contestName, 
        amount,quantity, pricePerQuantity, poolPrize, email, number, status, description} = req.body;

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
       
        console.log({payment:payment})

        const resp = await payment.save(payment);

        console.log(resp);

        res.send({
            success: "success", 
            message:"Payment saved successfully", 
            data: {
            id: resp._id,
            amount: resp.amount
        }
    })

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};


export const getPaymentStatus = async (req, res) => {
    try {


    } catch(error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
}
