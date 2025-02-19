import express from 'express';
const router = express();
import UserController from "../controllers/userController.js";
import {savePayment, getPaymentStatus} from "../controllers/paymentController.js";
import {authorizePeClient} from "../controllers/auth/auth.js"
/************************ User api **********************************/

router.post('/create-user', UserController.registerOrLogin)
router.get('/get-user', UserController.getUser)

router.post('/save-payment', savePayment)
router.post(`/status/:txnId`, getPaymentStatus);

router.get('/authorize/client')

router.get('/*', (req, res)=>{
    res.send("Welcome!")
})

export default router;
//*******************************************************************//