import Portfolio from "../models/portfolioModel.js";


export const createPortfolio = async (req, res) => {

    const { userId, holdAmount, soldAmount, profit, loss } = req.body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const requestPayload = {
            userId: userId,
            holdAmount: holdAmount || "0.000",
            soldAmount: soldAmount || "0.000",
            profit: profit || "0.000",
            loss: loss || "0.000"
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


export const getPortfolioHold = async (req, res) => {

    const { userId, salePrice, resalePrice } = req.body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const getPortfolio = await Portfolio.findOne({ userId: userId })

        if(!getPortfolio) {
            return res.status(404).json({ error: "No Portfolio found!" });
        }

        let updatedHoldAmount = 0;
        if(resalePrice) {
            updatedHoldAmount =  Number(getPortfolio.holdAmount) + Number(resalePrice) - Number(salePrice); 
        } else {
            updatedHoldAmount =  Number(getPortfolio.holdAmount) + Number(salePrice);
        }

        const updatedSoldAmount = Number(getPortfolio.soldAmount) + 0;

        const updatePortfolio = await Portfolio.updateOne(
            {userId: userId}, 
            {
                holdAmount: updatedHoldAmount, 
                soldAmount: updatedSoldAmount
            }
        )
       
        if(!updatePortfolio) {
            return res.status(400).json({ error: "Portfolio Updation fail" });
        }

        return res.status(200).json({
            success: true,
            message: "Porfolio Created",
            data: updatePortfolio
        });

    } catch (error) {
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
};




export const updatePortfolioSell = async (req, res) => {

    const { userId, salePrice, resalePrice } = req.body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {

        const getPortfolio = await Portfolio.findOne({ userId: userId })

        if(!getPortfolio) {
            return res.status(404).json({ error: "No Portfolio found!" });
        }

        let updatedHoldAmount = 0;
        if((Number(getPortfolio.holdAmount) - Number(salePrice)) < 0) {
            updatedHoldAmount =  0; 
        } else {
            updatedHoldAmount =  Number(getPortfolio.holdAmount) - Number(salePrice);
        }
       
        const updatedSoldAmount = Number(getPortfolio.soldAmount) + Number(resalePrice);

        const updatePortfolio = await Portfolio.updateOne(
            {userId: userId}, 
            {
                holdAmount: updatedHoldAmount, 
                soldAmount: updatedSoldAmount
            }
        )
       
        if(!updatePortfolio) {
            return res.status(400).json({ error: "Portfolio Updation fail" });
        }

        return res.status(200).json({
            success: true,
            message: "Porfolio Created",
            data: updatePortfolio
        });

    } catch (error) {
        res.status(500).json({ error: "Portfolio creation fail", details: error.message });
    }
};
