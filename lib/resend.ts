import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'production') {
    console.warn('Warning: RESEND_API_KEY is missing. Emails will not be sent.');
}

export const resend = new Resend(apiKey || 're_placeholder');
