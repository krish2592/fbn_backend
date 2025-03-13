import "dotenv/config";
import express from 'express';
import fileUpload from 'express-fileupload';
import route from './routes/routes.js';
const app = express();
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// import logger from "./logger.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

// import { WebSocketServer } from "ws";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


// Enable CORS middleware
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
//     credentials: true,
//   }));

// app.use(cors({
//     origin: '*',  // Allow all origins
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
//     credentials: true
//   }));

// app.use(cors())

// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = ['http://localhost:3000','http://192.168.1.34', 'http://192.168.1.37', 'http://192.168.32.236'];  // Add more trusted origins if needed
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET, POST, PUT, DELETE',
//   allowedHeaders: 'Content-Type, Authorization',
//   credentials: true
// }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.'
});

app.use(limiter);

// const PORT = 8080;
// const wss = new WebSocketServer({ port: PORT });


mongoose.connect(process.env.CONNECTION_STRING, {
  dbName: "fbn001",
  useNewUrlParser: true,
  useUnifiedTopology: true
  // serverSelectionTimeoutMS: 30000
})
  .then(() => {
    console.log(`${moduleName}: Database is connected`);
    // watchDatabase();
  }
  )
  .catch(err => console.log(err));

  const db = mongoose.connection;

//   function watchDatabase() {
//      const changeStream = db.watch()

//     changeStream.on("change", (change) => {
//         console.log("Data changed:", change);

//         // Send update to all connected WebSocket clients
//         wss.clients.forEach(client => {
//             if (client.readyState === 1) { // WebSocket.OPEN
//                 client.send(JSON.stringify(change));
//             }
//         });
//     });

//     console.log("Watching DB for changes...");
// }

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
  console.log(`${moduleName}: Express app running on port:`+ (process.env.PORT || 3000));
});