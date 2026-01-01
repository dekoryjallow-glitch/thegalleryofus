import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const logFile = path.resolve(process.cwd(), 'debug_final.log');
fs.writeFileSync(logFile, 'Starting debug script\n');

function log(msg: string | any) {
    const str = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
    fs.appendFileSync(logFile, str + '\n');
    console.log(str);
}

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { gelatoClient } = await import('../lib/gelato/client');

    log('Testing Gelato Client with corrected URL...');
    const key = process.env.GELATO_API_KEY;

    if (key) {
        log(`GELATO_API_KEY is SET (length: ${key.length})`);
    } else {
        log('GELATO_API_KEY is NOT set in process.env');
        return;
    }

    const dummyOrder = {
        productUid: "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor",
        imageUrl: "https://placehold.co/1000x1000.png",
        shippingAddress: {
            name: "Test User",
            addressLine1: "Test Street 1",
            city: "Berlin",
            zipCode: "10115",
            country: "DE",
            state: "Berlin"
        },
        quantity: 1
    };

    try {
        log('Sending draft order request via gelatoClient...');
        const response = await gelatoClient.createDraftOrder(dummyOrder);
        log('✅ Order created successfully: ' + JSON.stringify(response, null, 2));
    } catch (error: any) {
        log('❌ Failed to create order: ' + error.message);
        if (error.response?.data) {
            log('Response Data: ' + JSON.stringify(error.response.data, null, 2));
        } else if (error.data) {
            log('Error Data: ' + JSON.stringify(error.data, null, 2));
        }
    }
}

main().catch(e => log(e));
