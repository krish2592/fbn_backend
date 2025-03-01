import express from 'express';
const router = express();
import UserController from "../controllers/userController.js";
import {savePayment, savePaymentBuy,savePaymentSell, getPaymentStatus} from "../controllers/paymentController.js";
import {createTicket, getMyContest, updateTicket, transferTicket, searchTicket, activateTicket, deactivateTicket, upgradeTicket} from "../controllers/ticketController.js";
import { createContest, getAllContest } from '../controllers/contestController.js';
import {createPortfolio, getPortfolioHold, updatePortfolioSell} from '../controllers/portfolioController.js';

import {authorizePeClient} from "../controllers/auth/auth.js"

/************************ User api **********************************/
router.post('/create-user', UserController.registerOrLogin)
router.get('/get-user', UserController.getUser)


/*********************** Contest ***********************************/
router.post('/create-contest', createContest)
router.get('/get-all-contest', getAllContest)


/************************ Payment **********************************/
router.post('/save-payment', savePayment)
router.post('/save-payment-buy', savePaymentBuy)
router.post('/save-payment-sell', savePaymentSell)
router.post(`/status/:txnId`, getPaymentStatus);


/************************ Ticket ***********************************/
router.post('/create-ticket', createTicket)
router.get('/get-my-contest', getMyContest)
router.patch('/update-ticket-buy', updateTicket)
router.post('/upgrade-ticket', upgradeTicket)
router.post('/transfer-ticket', transferTicket)
router.post('/activate-ticket', activateTicket)
router.post('/deactivate-ticket', deactivateTicket)
router.get('/search-ticket', searchTicket)


/************************ Portfolio ********************************/
router.post('/create-portfolio', createPortfolio)
router.get('/portfolio-hold', getPortfolioHold)
router.post('/update-portfolio-sell', updatePortfolioSell)

router.get('/authorize/client')

router.get('/*', (req, res)=>{
    res.send("Welcome!")
})

export default router;
//*******************************************************************//