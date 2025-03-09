// import multer from 'multer';
import xlsx from 'xlsx';
import Prize from '../models/prizeModel.js';
// Multer Setup for File Uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

import path from 'path'

// API to Upload and Read Excel
export const savedata = async (req, res) => {
    try {

        const filePath = path.join("C:\\Local Disk\\All Business\\Prize Distribution Chart.xlsx");
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[8]; // Change index if using a different sheet
        const sheet = workbook.Sheets[sheetName];

        let jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Remove first row (headers) and last row
        jsonData = jsonData.slice(1, -1);

        // console.log(jsonData);

        // Extract only required columns
        const extractedData = jsonData.map((row) => ({
            contestName: row[0], 
            rank: row[1],
            noOfPerson: row[3], 
            percentage: Math.round(row[4]*10000)/100, 
            initialDistribution: Math.round(row[5]),
            initialDistributionEach: Math.round(row[6]),
            targetDistribution: Math.round(row[8]),
            targetDistributionEach: Math.round(row[9])
        }));

        console.log(extractedData)

        // Save to Database
        // await Prize.insertMany(extractedData);
        res.json({ message: "Data uploaded and saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};