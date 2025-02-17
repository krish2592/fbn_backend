import "dotenv/config";
import express from 'express';
import fileUpload from 'express-fileupload';
import route from './routes/routes.js';
const app = express();
import mongoose  from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
//https://infytechai.com

// Enable CORS middleware
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET, POST, PUT, DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
//     credentials: true,
//   }));

app.use(cors({
    origin: '*',  // Allow all origins
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  }));

// app.use(cors())

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.'
});

app.use(limiter);


mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) );

app.use('/', route);

const ip = '0.0.0.0'
app.listen(process.env.PORT || 3000, ip, function () {
    console.log('Express app running on port ' + (process.env.PORT||3000));
});