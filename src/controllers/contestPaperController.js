import Paper from '../models/contestPaperModel.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const createContestPaper = async (req, res) => {
    try {

        console.log(`${moduleName}: Create contest started`);
        // const {contestName, questions}  = req.body

        const requestPayload = {

            contestName: "KBFBN000050L",
            contestPaper: [
                { "qid": "FBN001", "question": "How many runs has Virat Kohli scored in the IPL after the 2027 season?", "category": "sports", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN002", "question": "How many total seats will BJP (including alliances) win in the 2027 UP Elections?", "category": "politics", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN003", "question": "How many total centuries will be scored in the IPL 2027 season?", "category": "sports", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN004", "question": "How many total seats will Congress (including alliances) win in the 2027 UP Elections?", "category": "politics", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN005", "question": "In how many balls will the fastest century be scored in the IPL 2027 season?", "category": "sports", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN006", "question": "How many total bowlers will take more than 3 wickets in the IPL 2027 season?", "category": "sports", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN007", "question": "How many wickets has Jasprit Bumrah taken in the IPL after the 2027 season?", "category": "sports", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN008", "question": "How many total seats will BJP (including alliances) win in the 2027 Punjab Elections?", "category": "politics", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN009", "question": "How many total sixes will be hit in the IPL 2027 season?", "category": "sports", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN010", "question": "How many total seats will Congress (including alliances) win in the 2027 Punjab Elections?", "category": "politics", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN011", "question": "How many total seats will AAP (including alliances) win in the 2027 Punjab Elections?", "category": "politics", "isLocked": false, "lockedOn": "To be updated" },
                { "qid": "FBN012", "question": "What will be the price of 1 Bitcoin in Indian Rupees (INR) on 1st March 2027?", "category": "currencies", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN013", "question": "What will be the exchange rate of 1 US Dollar in Indian Rupees (INR) on 1st March 2027?", "category": "currencies", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN014", "question": "What will be the closing value of the SENSEX in INR on 1st March 2027?", "category": "stock", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN015", "question": "What will be the closing value of the NIFTY 50 on 1st March 2027?", "category": "stock", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN016", "question": "What will be the closing stock price of Reliance Industries Ltd in INR on 1st March 2027?", "category": "stock", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN017", "question": "What will be the closing stock price of Tata Motors Ltd in INR on 1st March 2027?", "category": "stock", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN018", "question": "What will be the closing stock price of Zomato Ltd in INR on 1st March 2027?", "category": "stock", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN019", "question": "What will be the price of 1 Ethereum coin in Indian Rupees (INR) on 1st March 2027?", "category": "currencies", "isLocked": false, "lockedOn": "01/02/2027" },
                { "qid": "FBN020", "question": "What will be the petrol price in INR on 1st March 2027 in Delhi?", "category": "general", "isLocked": false, "lockedOn": "01/02/2027" },
            ],
            isContestLocked: false
        }

        const result = await Paper.create(requestPayload)

        res.send({ success: true, message: "Contest data fetched sucess", data: result })
    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        console.error("Finding Contest Paper Error: ", error);
    }
}


export const getContestPaper = async (req, res) => {
    try {

        console.log(`${moduleName}: Get contest paper started`);

        const { query } = req.query;

        console.log(query);

        const result = await Paper.findOne({ contestName: query?.trim(), isDeleted: false })
        .select({_id:0, isDeleted: false, isContestLocked: false, createdAt:0, updatedAt:0, __v:0})

        if(!result) {
            const respPayload = {
                success : true,
                message : "Get contest paper success",
                contestName : query.trim(),
                isContestLocked : false,
                data: []
            }
    
            return res.status(200).send(respPayload)
        }

        const respPayload = {
            success : true,
            message : "Get contest paper success",
            contestName : query.trim(),
            isContestLocked : false,
            data: result.contestPaper
        }

        res.status(200).send(respPayload)

    } catch (error) {
        console.error("Get Contest Paper Error:", error)
    }
}