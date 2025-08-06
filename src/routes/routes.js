import express from 'express';
const router = express();
import UserController from "../controllers/userController.js";
import { savePayment, savePaymentBuy, savePaymentSell } from "../controllers/paymentController.js";
import {
    createTicket, getMyContest, updateTicket,
    transferTicket, searchTicket, activateTicket,
    deactivateTicket, upgradeTicket, getTicket,
    getAllTicketByContestName,
    validateTicket,
} from "../controllers/ticketController.js";
import { createContest, getAllContest } from '../controllers/contestController.js';
import { createPortfolio, getPortfolio, getPortfolioHold, updatePortfolioSell } from '../controllers/portfolioController.js';
import { getPrizeDistribution } from '../controllers/prizeController.js';

import { auth, authorize } from "../controllers/auth/auth.js"

import { createSupportTicket, getUserTickets, addMessageUser } from "../controllers/supportController.js"
import { createContestPaper, getContestPaper } from '../controllers/contestPaperController.js';

import { getUserPaperResponse, saveUserPaperResponse, submitUserPaperResponse } from '../controllers/userResponseController.js';

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

/************************ Contest Paper ***********************************/
router.post('/create-contest-paper', auth, createContestPaper)
router.get('/get-contest-paper', auth, getContestPaper)

/************************* User Response ***************************/
router.post('/save-user-paper-response', auth, authorize, saveUserPaperResponse)
router.post('/submit-user-paper-response', auth, authorize, submitUserPaperResponse)
router.get('/get-user-paper-response', auth, authorize, getUserPaperResponse)

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
router.get('/get-ticket', auth, getTicket)
router.post('/get-all-ticket-by-contest', auth, authorize, getAllTicketByContestName)
router.post('/validate-ticket', auth, validateTicket)


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