import Contest from "../models/contestModel.js"


export const createContest = async (req, res) => {

    const contests = [
        {
            contestName: "KBFBN000001",
            contestId: "FBN000001",
            totalQuantity: "20000",
            quantitySold: "0",
            initialPrice: "200",
            todayPrice: "200",
            initialPoolPrize: "25L",
            targetPoolPrize: "2.5CR",
            startDate: "April, 2025",
            maxDuration: "5Y",
            contestType: "Basic01"
        },
        {
            contestName: "KBFBN000005",
            contestId: "FBN000005",
            totalQuantity: "32500",
            quantitySold: "0",
            initialPrice: "300",
            todayPrice: "300",
            initialPoolPrize: "50L",
            targetPoolPrize: "5CR",
            startDate: "April, 2025",
            maxDuration: "5Y",
            contestType: "Basic02"
        },
        {
            contestName: "KBFBN000010",
            contestId: "FBN000010",
            totalQuantity: "40000",
            quantitySold: "0",
            initialPrice: "400",
            todayPrice: "400",
            initialPoolPrize: "1CR",
            targetPoolPrize: "10CR",
            startDate: "April, 2025",
            maxDuration: "5Y",
            contestType: "Basic03"
        },
        {
            contestName: "KBFBN000025",
            contestId: "FBN000025",
            totalQuantity: "50000",
            quantitySold: "0",
            initialPrice: "700",
            todayPrice: "700",
            initialPoolPrize: "2CR",
            targetPoolPrize: "25CR",
            startDate: "April, 2025",
            maxDuration: "5Y",
            contestType: "Basic04"
        },
        {
            contestName: "KBFBN000050",
            contestId: "FBN000050",
            totalQuantity: "100000",
            quantitySold: "0",
            initialPrice: "800",
            todayPrice: "800",
            initialPoolPrize: "5CR",
            targetPoolPrize: "50CR",
            startDate: "April, 2025",
            maxDuration: "7Y",
            contestType: "Basic05"
        },
        {
            contestName: "KBFBN000100",
            contestId: "FBN000100",
            totalQuantity: "200000",
            quantitySold: "0",
            initialPrice: "1000",
            todayPrice: "1000",
            initialPoolPrize: "10CR",
            targetPoolPrize: "100CR",
            startDate: "April, 2025",
            maxDuration: "8Y",
            contestType: "Intermediate01"
        },
        {
            contestName: "KBFBN000250",
            contestId: "FBN000250",
            totalQuantity: "300000",
            quantitySold: "0",
            initialPrice: "1500",
            todayPrice: "1500",
            initialPoolPrize: "25CR",
            targetPoolPrize: "250CR",
            startDate: "April, 2025",
            maxDuration: "9Y",
            contestType: "Intermediate02"
        },
        {
            contestName: "KBFBN000500",
            contestId: "FBN000500",
            totalQuantity: "400000",
            quantitySold: "0",
            initialPrice: "2000",
            todayPrice: "2000",
            initialPoolPrize: "50CR",
            targetPoolPrize: "500CR",
            startDate: "April, 2025",
            maxDuration: "10Y",
            contestType: "Intermediate03"
        },
        {
            contestName: "KBFBN001000",
            contestId: "FBN001000",
            totalQuantity: "600000",
            quantitySold: "0",
            initialPrice: "2700",
            todayPrice: "2700",
            initialPoolPrize: "100CR",
            targetPoolPrize: "1000CR",
            startDate: "April, 2025",
            maxDuration: "12Y",
            contestType: "Mega01"
        },
        {
            contestName: "KBFBN002500",
            contestId: "FBN002500",
            totalQuantity: "1250000",
            quantitySold: "0",
            initialPrice: "3000",
            todayPrice: "3000",
            initialPoolPrize: "200CR",
            targetPoolPrize: "2500CR",
            startDate: "April, 2025",
            maxDuration: "14Y",
            contestType: "Mega02",
            isDeleted: "true"
        },
        {
            contestName: "KBFBN005000",
            contestId: "FBN005000",
            totalQuantity: "1500000",
            quantitySold: "0",
            initialPrice: "5500",
            todayPrice: "5500",
            initialPoolPrize: "500CR",
            targetPoolPrize: "5000CR",
            startDate: "April, 2025",
            maxDuration: "16Y",
            contestType: "Mega03",
            isDeleted: "true"
        },
        {
            contestName: "KBFBN010000",
            contestId: "FBN010000",
            totalQuantity: "2000000",
            quantitySold: "0",
            initialPrice: "8500",
            todayPrice: "8500",
            initialPoolPrize: "1000CR",
            targetPoolPrize: "10000CR",
            startDate: "April, 2025",
            maxDuration: "18Y",
            contestType: "Mega04",
            isDeleted: "true"
        }

    ]


    try {
        const result = await Contest.insertMany(contests)
        console.log("Bulk insert successful:", result);
        res.send({status: "success", data:result})

    } catch (err) {
        console.error("Bulk insert failed:", err);
    }

}



export const getAllContest = async(req, res) => {
    try{
        console.log("Get all contest start")
        const result = await Contest.find({isDeleted:false})
        .sort({ quantitySold: -1 }) 
        .select({_id:0, createdAt:0, updatedAt:0, __v:0, isDeleted:0})
        console.log(result);
        res.send({success: true, message:"Contest data fetched sucess", data:result})
    } catch(err) {
        console.error("Finding Contest Error:", err);
    }
}