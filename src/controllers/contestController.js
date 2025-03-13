import Contest from "../models/contestModel.js"
// import logger from "../logger.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const createContest = async (req, res) => {

    // const contests = [
    //     {
    //         contestName: "KBFBN000050L",
    //         contestId: "FBN000050L",
    //         totalQuantity: 25000,
    //         quantitySold: 0,
    //         initialPrice: "200",
    //         todayPrice: "200",
    //         initialPoolPrize: "25L",
    //         targetPoolPrize: "50L",
    //         startDate: "April, 2025",
    //         maxDuration: "2Y",
    //         contestType: "Basic01"
    //     },
    //     {
    //         contestName: "KBFBN00001CR",
    //         contestId: "FBN00001CR",
    //         totalQuantity: 35000,
    //         quantitySold: 0,
    //         initialPrice: "300",
    //         todayPrice: "300",
    //         initialPoolPrize: "50L",
    //         targetPoolPrize: "1CR",
    //         startDate: "April, 2025",
    //         maxDuration: "2Y",
    //         contestType: "Basic02"
    //     },
    //     {
    //         contestName: "KBFBN00002CR",
    //         contestId: "FBN00002CR",
    //         totalQuantity: 45000,
    //         quantitySold: 0,
    //         initialPrice: "400",
    //         todayPrice: "400",
    //         initialPoolPrize: "1CR",
    //         targetPoolPrize: "2CR",
    //         startDate: "April, 2025",
    //         maxDuration: "2Y",
    //         contestType: "Basic03"
    //     },
    //     {
    //         contestName: "KBFBN00004CR",
    //         contestId: "FBN00004CR",
    //         totalQuantity: 55000,
    //         quantitySold: 0,
    //         initialPrice: "700",
    //         todayPrice: "700",
    //         initialPoolPrize: "2CR",
    //         targetPoolPrize: "4CR",
    //         startDate: "April, 2025",
    //         maxDuration: "3Y",
    //         contestType: "Basic04"
    //     },
    //     {
    //         contestName: "KBFBN00010CR",
    //         contestId: "FBN00010CR",
    //         totalQuantity: 150000,
    //         quantitySold: 0,
    //         initialPrice: "900",
    //         todayPrice: "900",
    //         initialPoolPrize: "5CR",
    //         targetPoolPrize: "10CR",
    //         startDate: "April, 2025",
    //         maxDuration: "3Y",
    //         contestType: "Basic05"
    //     },
    //     {
    //         contestName: "KBFBN00020CR",
    //         contestId: "FBN00020CR",
    //         totalQuantity: 250000,
    //         quantitySold: 0,
    //         initialPrice: "1000",
    //         todayPrice: "1000",
    //         initialPoolPrize: "10CR",
    //         targetPoolPrize: "20CR",
    //         startDate: "April, 2025",
    //         maxDuration: "4Y",
    //         contestType: "Intermediate01"
    //     },
    //     {
    //         contestName: "KBFBN00050CR",
    //         contestId: "FBN00050CR",
    //         totalQuantity: 350000,
    //         quantitySold: 0,
    //         initialPrice: "1500",
    //         todayPrice: "1500",
    //         initialPoolPrize: "25CR",
    //         targetPoolPrize: "50CR",
    //         startDate: "April, 2025",
    //         maxDuration: "4Y",
    //         contestType: "Intermediate02"
    //     },
    //     {
    //         contestName: "KBFBN00100CR",
    //         contestId: "FBN00100CR",
    //         totalQuantity: 450000,
    //         quantitySold: 0,
    //         initialPrice: "2000",
    //         todayPrice: "2000",
    //         initialPoolPrize: "50CR",
    //         targetPoolPrize: "100CR",
    //         startDate: "April, 2025",
    //         maxDuration: "5Y",
    //         contestType: "Intermediate03"
    //     },
    //     {
    //         contestName: "KBFBN00200CR",
    //         contestId: "FBN00200CR",
    //         totalQuantity: 650000,
    //         quantitySold: 0,
    //         initialPrice: "2800",
    //         todayPrice: "2800",
    //         initialPoolPrize: "100CR",
    //         targetPoolPrize: "200CR",
    //         startDate: "April, 2025",
    //         maxDuration: "5Y",
    //         contestType: "Mega01"
    //     },

    // ]


    // try {
    //     const result = await Contest.insertMany(contests)
    //     console.log("Bulk insert successful:", result);
    //     res.send({status: "success", data:result})

    // } catch (err) {
    //     console.error("Bulk insert failed:", err);
    // }

}



export const getAllContest = async(req, res) => {
    try{
        console.log(`${moduleName}: Get all contest started`);
        const result = await Contest.find({isDeleted:false})
        .sort({ totalQuantity: 1 }) 
        .select({_id:0, createdAt:0, updatedAt:0, __v:0, isDeleted:0})
        res.send({success: true, message:"Contest data fetched sucess", data:result})
    } catch(error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        console.error("Finding Contest Error: ", error);
    }
}