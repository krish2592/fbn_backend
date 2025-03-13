import "dotenv/config";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { createId } from '@paralleldrive/cuid2';
import logger from "../logger.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const moduleName = __filename;
// Secret key used for signing/verifying tickets
const SECRET_KEY =  process.env.TICKET_SECRET_KEY;

export function generateTicketId() {
    const randomValue = createId().toUpperCase();
    const baseString = `${randomValue}`;
    const hmac = crypto.createHmac('sha256', SECRET_KEY).update(baseString).digest('hex');
    return `TFBN-${baseString}-${hmac.substring(0, 11).toUpperCase()}`;
}

// Generate ticket for user ID 12345
const ticketId = generateTicketId();


function verifyTicket(ticketId) {

    const parts = ticketId.split('-');

    if (parts.length !== 3) {
        logger.error(`${moduleName}: Invalid ticket format`);
        return false;
    }

    const randomValue = parts[1];
    const providedHmacPart = parts[2]; 
    const baseString = `${randomValue}`;

    const recalculatedHmac = crypto.createHmac('sha256', SECRET_KEY).update(baseString).digest('hex');
    if (recalculatedHmac.substring(0, 11).toUpperCase() === providedHmacPart) {
        logger.info(`${moduleName}: Ticket verification successful`);
        return true;
    } else {
        logger.error(`${moduleName}: Ticket verification failed`);
        return false;
    }
}

// Verify the ticket with user ID 12345
const isValid = verifyTicket(ticketId);
