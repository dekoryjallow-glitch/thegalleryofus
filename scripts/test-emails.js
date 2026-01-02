const fetch = require('node-fetch');

// Configuration
const LOCAL_URL = 'http://localhost:3000';
const TEST_ORDER_ID = 'YOUR_ORDER_ID'; // Replace with a real order ID from your Supabase 'orders' table
const TEST_EMAIL = 'recipient@example.com'; // Replace with your email for testing

async function testConfirmationEmail() {
    console.log('🧪 Testing Order Confirmation Email via Webhook...');

    // This mocks the payload Stripe would send
    const mockPayload = {
        id: 'evt_test_' + Date.now(),
        type: 'checkout.session.completed',
        data: {
            object: {
                id: 'cs_test_' + Date.now(),
                customer_details: {
                    email: TEST_EMAIL,
                    name: 'Test Customer'
                },
                shipping_details: {
                    name: 'Test Customer',
                    address: {
                        line1: 'Teststr. 123',
                        city: 'Berlin',
                        postal_code: '10115',
                        country: 'DE'
                    }
                },
                payment_status: 'paid',
                amount_total: 7490,
                currency: 'eur',
                // This would normally link to an order via metadata or checkout ID
                // For the test to work, you'd need an order in DB with this stripe_checkout_id
            }
        }
    };

    console.log('⚠️  Note: This test requires a valid order in your database with the matching stripe_checkout_id.');
    console.log('To test the UI flow instead, use the Admin Dashboard.');
}

async function testShippingEmail() {
    console.log('\n🧪 Testing Shipping Email via API...');

    if (TEST_ORDER_ID === 'YOUR_ORDER_ID') {
        console.error('❌ Error: Please set a real TEST_ORDER_ID in the script.');
        return;
    }

    try {
        const response = await fetch(`${LOCAL_URL}/api/admin/orders/ship`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: TEST_ORDER_ID,
                trackingNumber: 'TEST-TRACKING-123456',
                trackingUrl: 'https://www.dhl.de/en/privatkunden/pakete-empfangen/verfolgen.html?piececode=TEST-TRACKING-123456'
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('✅ Success:', result);
        } else {
            console.error('❌ Failed:', result);
        }
    } catch (error) {
        console.error('❌ Fetch Error:', error);
    }
}

// Helper to check what's in the DB
async function listPaidOrders() {
    console.log('\n🔍 Tip: Run this SQL in Supabase to find a paid order ID:');
    console.log("SELECT id, status FROM orders WHERE status = 'paid' LIMIT 1;");
}

// Uncomment the one you want to test
// testShippingEmail();
listPaidOrders();
