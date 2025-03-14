import express from 'express';
const router = express();
import UserController from "../controllers/userController.js";
import { savePayment, savePaymentBuy, savePaymentSell } from "../controllers/paymentController.js";
import { createTicket, getMyContest, updateTicket, transferTicket, searchTicket, activateTicket, deactivateTicket, upgradeTicket } from "../controllers/ticketController.js";
import { createContest, getAllContest } from '../controllers/contestController.js';
import { createPortfolio, getPortfolio, getPortfolioHold, updatePortfolioSell } from '../controllers/portfolioController.js';
import { getPrizeDistribution } from '../controllers/prizeController.js';

import { auth, authorize } from "../controllers/auth/auth.js"

import { createSupportTicket, getUserTickets, addMessageUser } from "../controllers/supportController.js"


/************************ User api **********************************/
router.post('/create-user', UserController.registerOrLogin)
router.get('/get-user', UserController.getUser)
router.post('/refresh', UserController.refreshToken)


router.post('/update-name', auth, authorize, UserController.updateUserName)
router.post('/update-email', auth, authorize, UserController.updateUserEmail)
router.post('/update-phone', auth, authorize, UserController.updateUserPhone)
router.post('/update-dob', auth, authorize, UserController.updateUserDOB)

/*********************** Contest ***********************************/
router.post('/create-contest', createContest)
router.get('/get-all-contest', auth, getAllContest)


/************************ Payment **********************************/
router.post('/save-payment', auth, authorize, savePayment)
router.post('/save-payment-buy', auth, authorize, savePaymentBuy)
router.post('/save-payment-sell', auth, authorize, savePaymentSell)


/************************ Ticket ***********************************/
router.post('/create-ticket', auth, authorize, createTicket)
router.get('/get-my-contest', auth, getMyContest)
router.patch('/update-ticket-buy', auth, authorize, updateTicket)
router.post('/upgrade-ticket', auth, authorize, upgradeTicket)
router.post('/transfer-ticket', auth, authorize, transferTicket)
router.post('/activate-ticket', auth, authorize, activateTicket)
router.post('/deactivate-ticket', auth, authorize, deactivateTicket)
router.get('/search-ticket', auth, searchTicket)


/************************ Portfolio ********************************/
router.post('/create-portfolio', createPortfolio)
router.get('/get-portfolio', auth, getPortfolio)
router.get('/portfolio-hold', auth, getPortfolioHold)
router.post('/update-portfolio-completed', auth, authorize, updatePortfolioSell)


/************************ Distribution *****************************/
router.get('/get-prize-distribution', auth, getPrizeDistribution)


/************************ 24*7 Support *****************************/
router.post('/tickets/create', auth, createSupportTicket)
router.get('/tickets/get-all', auth, getUserTickets)
router.patch('/add/message', auth, addMessageUser)


router.get('/*', (req, res) => {
    res.send("Welcome!")
})

export default router;
//*******************************************************************//