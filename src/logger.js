// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';
// import "dotenv/config";

// // 🔒 Mask sensitive data in logs
// const maskSensitiveData = (message) => {
//     const strMessage = typeof message === 'string' ? message : JSON.stringify(message);
//     return strMessage.replace(/(password|token|secret)=\S+/gi, '$1=******');
// };

// // 🚀 Winston Logger Configuration
// const logger = winston.createLogger({
//     level: process.env.LOG_LEVEL || 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `${timestamp} [${level.toUpperCase()}]: ${maskSensitiveData(message)}`;
//         })
//     ),
//     transports: [
//         new winston.transports.Console(), 
//         new DailyRotateFile({             
//             filename: 'logs/app-%DATE%.log',
//             datePattern: 'YYYY-MM-DD',
//             maxFiles: '14d', // Keep logs for 14 days
//             zippedArchive: true,
//         })
//     ]
// });


// export default logger;

