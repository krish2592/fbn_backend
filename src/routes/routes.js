import express from 'express';
const router = express();
import UserController from "../controllers/userController.js";
import {savePayment, getPaymentStatus} from "../controllers/paymentController.js";
import {createTicket} from "../controllers/ticketController.js";
import { createContest, getAllContest } from '../controllers/contestController.js';

import {authorizePeClient} from "../controllers/auth/auth.js"

/************************ User api **********************************/
router.post('/create-user', UserController.registerOrLogin)
router.get('/get-user', UserController.getUser)


/*********************** Contest ***********************************/
router.post('/create-contest', createContest)
router.get('/get-all-contest', getAllContest)

/************************ Payment **********************************/
router.post('/save-payment', savePayment)
router.post(`/status/:txnId`, getPaymentStatus);


/************************ Ticket ***********************************/
router.post('/create-ticket', createTicket)
router.get('/authorize/client')

router.get('/*', (req, res)=>{
    res.send("Welcome!")
})

export default router;
//*******************************************************************//