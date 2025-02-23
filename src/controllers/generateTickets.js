import "dotenv/config";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { createId } from '@paralleldrive/cuid2';

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
console.log('Generated Ticket ID:', ticketId);


function verifyTicket(ticketId) {

    const parts = ticketId.split('-');

    if (parts.length !== 3) {
        console.log('Invalid ticket format');
        return false;
    }

    const randomValue = parts[1];
    const providedHmacPart = parts[2]; 
    const baseString = `${randomValue}`;

    const recalculatedHmac = crypto.createHmac('sha256', SECRET_KEY).update(baseString).digest('hex');
    if (recalculatedHmac.substring(0, 11).toUpperCase() === providedHmacPart) {
        console.log('Ticket verification successful');
        return true;
    } else {
        console.log('Ticket verification failed');
        return false;
    }
}

// Verify the ticket with user ID 12345
const isValid = verifyTicket(ticketId);
console.log(`Is ticket valid? ${isValid}`);
