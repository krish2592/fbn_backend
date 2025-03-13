import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
// import logger from "../../logger.js";
import { fileURLToPath } from 'url';
import Priviledge from '../../models/priviledgeModel.js';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;

export const auth = async (req, res, next) => {

    console.log(`${moduleName}: Authentication started`);

    const token = req.headers["authorization"]?.split(" ")[1] || req.headers["Authorization"]?.split(" ")[1];

    if (!token) {
        console.log(`${moduleName}: Access denied`);
        return res.status(401).json({ message: 'Access denied.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next(); 
    } catch (error) {
        console.log(`${moduleName}: Error: ${error} Message: ${error.message}`);
        res.status(403).json({ message: 'Authentication error' });
    }

} ;


export const authorize = async (req, res, next) => {

    console.log(`${moduleName}: Authorization started`);

    const {id } = req.user;
   
    if (!id) {
        return res.status(401).json({ message: 'Not authorize' });
    }

    try {
        const getUser = await User.findOne({userId: id, isDeleted: false}).select({userId:1})

        if(!getUser.userId) {
            console.log(`${moduleName}: Not an authorise user: ${id}`);
            return res.status(401).json({ message: 'Not an authorise user' });
        }

        next(); 

    } catch (error) {
        console.log(`${moduleName}: Error Message: ${error.message} Error: ${error}`);
        res.status(401).json({ message: 'Not authorize' });
    }

} ;


export const authorizeAdmin = async (req, res, next) => {

    console.log(`${moduleName}: Authorization started`);

    const {id } = req.user;
   
    if (!id) {
        return res.status(401).json({ message: 'Not authorize' });
    }

    try {
        const getUser = await Priviledge.findOne({userId: id, isDeleted: false})

        if(!getUser.userId) {
            console.log(`${moduleName}: Not an authorise user: ${id}`);
            return res.status(401).json({ message: 'Not an authorise user' });
        }

        if(getUser.accountType = "admin") {
            next(); 
        } 
    } catch (error) {
        console.log(`${moduleName}: Error Message: ${error.message} Error: ${error}`);
        res.status(401).json({ message: 'Not authorize' });
    }

} ;


export const authorizeDeveloper = async (req, res, next) => {

    console.log(`${moduleName}: Authorization started`);

    const {id } = req.user;
   
    if (!id) {
        return res.status(401).json({ message: 'Not authorize' });
    }

    try {
        const getUser = await Priviledge.findOne({userId: id, isDeleted: false})

        if(!getUser.userId) {
            console.log(`${moduleName}: Not an authorise user: ${id}`);
            return res.status(401).json({ message: 'Not an authorise user' });
        }

        if(getUser.accountType = "developer") {
            next(); 
        } 
    } catch (error) {
        console.log(`${moduleName}: Error Message: ${error.message} Error: ${error}`);
        res.status(401).json({ message: 'Not authorize' });
    }

} ;


export const authorizeSupport = async (req, res, next) => {

    console.log(`${moduleName}: Authorization started`);

    const {id } = req.user;
   
    if (!id) {
        return res.status(401).json({ message: 'Not authorize' });
    }

    try {
        const getUser = await Priviledge.findOne({userId: id, isDeleted: false})

        if(!getUser.userId) {
            console.log(`${moduleName}: Not an authorise user: ${id}`);
            return res.status(401).json({ message: 'Not an authorise user' });
        }

        if(getUser.accountType = "support") {
            next(); 
        } 
    } catch (error) {
        console.log(`${moduleName}: Error Message: ${error.message} Error: ${error}`);
        res.status(401).json({ message: 'Not authorize' });
    }

} ;