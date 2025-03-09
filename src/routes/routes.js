import express from 'express';
const router = express();
import UserController from "../controllers/userController.js";
import {savePayment, savePaymentBuy,savePaymentSell, getPaymentStatus} from "../controllers/paymentController.js";
import {createTicket, getMyContest, updateTicket, transferTicket, searchTicket, activateTicket, deactivateTicket, upgradeTicket} from "../controllers/ticketController.js";
import { createContest, getAllContest } from '../controllers/contestController.js';
import {createPortfolio, getPortfolio, getPortfolioHold, updatePortfolioSell} from '../controllers/portfolioController.js';
import {getPrizeDistribution} from '../controllers/prizeController.js';

import {savedata} from "../controllers/temporaryPrizeController.js"
import {authorizePeClient} from "../controllers/auth/auth.js"

import {createSupportTicket, getUserTickets, addMessageUser} from "../controllers/supportController.js"


/************************ User api **********************************/
router.post('/create-user', UserController.registerOrLogin)
router.get('/get-user', UserController.getUser)

router.post('/update-name', UserController.updateUserName)
router.post('/update-email', UserController.updateUserEmail)
router.post('/update-phone', UserController.updateUserPhone)
router.post('/update-dob', UserController.updateUserDOB)

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
router.get('/get-portfolio', getPortfolio)
router.get('/portfolio-hold', getPortfolioHold)
router.post('/update-portfolio-completed', updatePortfolioSell)


/************************ Distribution *****************************/
router.get('/get-prize-distribution', getPrizeDistribution)


/************************ 24*7 Support *****************************/
router.post('/tickets/create', createSupportTicket)
router.get('/tickets/get-all', getUserTickets)
router.patch('/add/message', addMessageUser)

router.get('/authorize/client')
router.post('/save-data-from-excel', savedata)



router.get('/*', (req, res)=>{
    res.send("Welcome!")
})

export default router;
//*******************************************************************//