import "dotenv/config";
import crypto from 'crypto';

// Secret key used for signing/verifying tickets
const SECRET_KEY =  process.env.TICKET_SECRET_KEY;

export function generateTicketId() {
    const timestamp = Date.now().toString();
    const baseString = `${timestamp}`;
    const hmac = crypto.createHmac('sha256', SECRET_KEY).update(baseString).digest('hex');
    return `TFBN_${baseString}_${hmac.substring(0, 11).toUpperCase()}`;
}

// Generate ticket for user ID 12345
const ticketId = generateTicketId();
console.log('Generated Ticket ID:', ticketId);

function verifyTicket(ticketId) {
    const parts = ticketId.split('_');
    if (parts.length !== 3) {
        console.log('Invalid ticket format');
        return false;
    }
    const timestamp = parts[1];
    const providedHmacPart = parts[2]; 
    const baseString = `${timestamp}`;
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
