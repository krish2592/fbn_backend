import Contest from "../models/contestModel.js";
import Portfolio from "../models/portfolioModel.js";
import Ticket from "../models/ticketModel.js";
// import logger from '../logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const createPortfolio = async (req, res) => {

    const { userId, holdAmount, soldAmount, holdQuantity, soldQuantity, profit, loss } = req.body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const requestPayload = {
            userId: userId,
            holdAmount: holdAmount || 0.00,
            holdQuantity: holdQuantity || 0,
            soldAmount: soldAmount || 0.00,
            soldQuantity: soldQuantity || 0,
            profit: profit || 0.00,
            loss: loss || 0.00
        }

        const portfolio = new Portfolio(requestPayload)
        await portfolio.save()

        return res.status(200).json({
            success: true,
            message: "Porfolio Created",
            data: portfolio
        });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        res.status(500).json({ error: "Portfolio creation failed", details: error.message });
    }
};


export const getPortfolio = async(req, res) => {

    const { userId } = req.query

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const getPortfolio = await Portfolio.findOne({ userId: userId, isDeleted: false })

        if (!getPortfolio) {

            const defaultPortfolio = {
                userId: userId,
                totalInvested: 0.00,
                totalHoldQuantity: 0,
                totalSold: 0.00,
                totalSoldQuantity: 0,
                totalProfit: 0.00,
                totalLoss: 0.00
            }

            return res.status(200).json({
                success: true,
                message: "Default portfolio",
                data: defaultPortfolio
            });
        }

        const responsePayload = {
            userId: getPortfolio.userId,
            totalInvested: getPortfolio.holdAmount || 0.00,
            totalHoldQuantity: getPortfolio.holdQuantity || 0,
            totalSold: getPortfolio.soldAmount || 0.00,
            totalSoldQuantity: getPortfolio.soldQuantity || 0,
            totalProfit: getPortfolio.profit || 0.00,
            totalLoss: getPortfolio.loss || 0.00
        }

        return res.status(200).json({
            success: true,
            message: "Porfolio Fetched Success",
            data: responsePayload
        });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
}

export const getPortfolioHold = async (req, res) => {

    const { userId } = req.query

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const respData = await Ticket.aggregate([
            {
                $match: { userId: userId, isDeleted: false }
            },
            {
                $group: {
                    _id: null,
                    totalInvested: {
                        $sum: {
                            $toDouble: { $ifNull: ["$salePrice", "0"] }
                        }
                    },
                    totalCount: { $sum: 1 }
                }
            }
        ])

        if(!respData || respData.length == 0) {
            return res.status(400).json({ error: "No holdings found" });
        }

        return res.status(200).json({
            success: true,
            message: "Invtested amount fetch success",
            data: {
                userId: userId,
                totalInvested: respData[0].totalInvested || 0.00,
                totalHoldQuantity: respData[0].totalCount || 0
            }
        });

            // .then(result => {
            //     return res.status(200).json({
            //         success: true,
            //         message: "Invtested amount fetch success",
            //         data: {
            //             totalInvested: result[0].totalInvested || 0.00,
            //             totalHoldQuantity: result[0].totalCount || 0
            //         }
            //     });
            // })
            // .catch(err => {
            //     console.error("Aggregation error:", err);
            // });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
};


export const updatePortfolioSell = async (req, res) => {

    const { userId, previousPrice, todayPrice, soldQuantity } = req.body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const getPortfolio = await Portfolio.findOne({ userId: userId, isDeleted: false })

        if (!getPortfolio) {
            return res.status(404).json({ error: "No Portfolio found!" });
        }

        const updatedSoldAmount = Number(getPortfolio.soldAmount) + Number(todayPrice)
        const profit = Number(getPortfolio.profit)+ Number(todayPrice) - Number(previousPrice)
        const updatedSoldQuantity = Number(getPortfolio.soldQuantity) + Number(soldQuantity) 

        const updatePortfolio = await Portfolio.updateOne(
            { userId: userId },
            {
                soldAmount: updatedSoldAmount,
                soldQuantity: updatedSoldQuantity,
                profit: profit
            }
        )

        if (!updatePortfolio) {
            return res.status(400).json({ error: "Portfolio Updation fail" });
        }

        const responsePayload = {
            userId: updatePortfolio.userId,
            totalInvested: updatePortfolio.holdAmount,
            totalHoldQuantity: updatePortfolio.holdQuantity,
            totalSold: updatePortfolio.soldAmount,
            totalSoldQuantity: updatePortfolio.soldQuantity,
            totalProfit: updatePortfolio.profit,
            totalLoss: updatePortfolio.loss
        }

        return res.status(200).json({
            success: true,
            message: "Porfolio Updated Success",
            data: responsePayload
        });

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
};


export async function updateUserPortfolio(userId) {
    const aggregationResult = await Ticket.aggregate([
        {
            $match: { userId: userId, isDeleted: false }
        },
        {
            $group: {
                _id: null,
                holdAmount: {
                    $sum: {
                        $toDouble: { $ifNull: ["$salePrice", "0"] }
                    }
                },
                holdQuantity: { $sum: 1 }
            }
        }
    ]);

    console.log(aggregationResult[0])

    const { holdAmount = 0, holdQuantity = 0 } = aggregationResult[0] || {};

    await Portfolio.findOneAndUpdate(
        { userId },
        { holdAmount, holdQuantity },
        { upsert: true, new: true }
    );
}
