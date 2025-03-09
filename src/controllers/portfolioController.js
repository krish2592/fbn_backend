import Contest from "../models/contestModel.js";
import Portfolio from "../models/portfolioModel.js";
import Ticket from "../models/ticketModel.js";


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
            return res.status(404).json({ error: "No Portfolio found!" });
        }

        const responsePayload = {
            userId: getPortfolio.userId,
            totalInvested: getPortfolio.holdAmount,
            totalHoldQuantity: getPortfolio.holdQuantity,
            totalSold: getPortfolio.soldAmount,
            totalSoldQuantity: getPortfolio.soldQuantity,
            totalProfit: getPortfolio.profit,
            totalLoss: getPortfolio.loss
        }

        return res.status(200).json({
            success: true,
            message: "Porfolio Fetched Success",
            data: responsePayload
        });

    } catch (error) {
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
}

export const getPortfolioHold = async (req, res) => {

    const { userId } = req.query

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        await Ticket.aggregate([
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
            .then(result => {
                return res.status(200).json({
                    success: true,
                    message: "Invtested amount fetch success",
                    data: {
                        totalInvested: result[0].totalInvested,
                        totalHoldQuantity: result[0].totalCount
                    }
                });
            })
            .catch(err => {
                console.error("Aggregation error:", err);
            });

    } catch (error) {
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
};


export const updatePortfolioSell = async (req, res) => {

    const { userId, previousPrice, todayPrice, soldQuantity } = req.body

    console.log("updatePortfolioSell started", userId, previousPrice, todayPrice, soldQuantity)

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const getPortfolio = await Portfolio.findOne({ userId: userId, isDeleted: false })

        if (!getPortfolio) {
            return res.status(404).json({ error: "No Portfolio found!" });
        }

        console.log({getPortfolio: getPortfolio})

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

        console.log({updatePortfolio: updatePortfolio})

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
