import "dotenv/config";
import Payment from '../models/paymentModel.js';
import {generateTicketId} from '../controllers/generateTickets.js';
import Ticket from "../models/ticketModel.js";

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
        quantity, 
        pricePerQuantity
        } = req.body;

    const tickets = [];

    for(let i=0; i<quantity; i++) {
        tickets.push(generateTicketId());
    }

    console.log(tickets);

   const reqPayload = []
   
    for(let i=0; i<tickets.length; i++) {
        const payload = {}
        payload["userId"] =  userId;
        payload["paymentId"] = razorpayPaymentId;
        payload["ticketId"] = tickets[i];
        payload["contestName"] = contestName;
        payload["salePrice"] = pricePerQuantity;
        payload["resalePrice"] = "NA";
        reqPayload.push(payload)
    }
        console.log("ggg", reqPayload);
        // const ticket = new Ticket(reqPayload)
        try {
            const result = await Ticket.insertMany(reqPayload)
            console.log("Bulk insert successful:", result);
        } catch(err) {
            console.error("Bulk insert failed:", err);
        } 
    
}