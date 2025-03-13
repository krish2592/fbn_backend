import Prize from "../models/prizeModel.js";
// import logger from '../logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const getPrizeDistribution = async (req, res) => {

    try {

        const { contest } = req.query;
        const getDistributionData = await Prize.find({ contestName: contest, isDeleted: false })
        .sort({initialDistributionEach: -1})

        const response = []
        getDistributionData.map((distributionData) => {
           const data = {}
           data["contest"] = distributionData.contestName;
           data["position"] = distributionData.rank;
           data["person"] = distributionData.noOfPerson;
           data["percentage"] = distributionData.percentage;
           data["initialDistribution"] = distributionData.initialDistribution;
           data["initialDistributionEach"] = distributionData.initialDistributionEach;
           data["targetDistribution"] = distributionData.targetDistribution;
           data["targetDistributionEach"] = distributionData.targetDistributionEach;
           response.push(data)
        })


        const aggregateData = await Prize.aggregate([
            {
                $match: { contestName: contest, isDeleted: false }
            },
            {
                $group: {
                    _id: null,
                    totalPerson: {
                        $sum: {
                            $toInt: { $ifNull: ["$noOfPerson", "0"] }
                        }
                    },
                    totalPercentage: {
                        $sum: {
                            $toDouble: { $ifNull: ["$percentage", "0"] }
                        }
                    },
                    totalInitialDistribution: {
                        $sum: {
                            $toDouble: { $ifNull: ["$initialDistribution", "0"] }
                        }
                    },
                    totalTargetDistribution: {
                        $sum: {
                            $toDouble: { $ifNull: ["$targetDistribution", "0"] }
                        }
                    }
                }
            }
        ])
    
        const agrregateResponse = {
            totalPerson: aggregateData[0].totalPerson,
            totalPercentage: aggregateData[0].totalPercentage,
            totalInitialDistribution: aggregateData[0].totalInitialDistribution,
            totalTargetDistribution: aggregateData[0].totalTargetDistribution,
        }

        return res.send({ status: "success",message:"distribution data fetched success!",  data: response, aggregateData: agrregateResponse })

    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        console.error("Prize distribution fetch failed:", error);
    }

}