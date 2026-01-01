import { NextResponse } from "next/server";
import { gelatoClient } from "@/lib/gelato/client";

export const dynamic = 'force-dynamic';

/**
 * Test-Endpunkt für Gelato API
 * GET /api/test-gelato - Testet die Gelato API mit Dummy-Daten
 */
export async function GET(req: Request) {
    try {
        // Prüfe ob GELATO_API_KEY gesetzt ist
        if (!process.env.GELATO_API_KEY) {
            return NextResponse.json({
                success: false,
                error: "GELATO_API_KEY environment variable is not set",
                hint: "Set GELATO_API_KEY in your .env.local file",
            }, { status: 500 });
        }

        // Dummy-Daten für Test
        const testData = {
            productUid: "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor",
            imageUrl: "https://replicate.delivery/pbxt/test-image.jpg", // Beispiel-URL
            shippingAddress: {
                name: "Test Customer",
                addressLine1: "Teststraße 123",
                addressLine2: "",
                city: "Berlin",
                state: "",
                zipCode: "10115",
                country: "DE",
            },
            quantity: 1,
        };

        console.log("[Test Gelato API] Testing with dummy data:", {
            productUid: testData.productUid,
            imageUrl: testData.imageUrl,
            shippingAddress: testData.shippingAddress,
        });

        // Versuche eine Draft Order zu erstellen
        const result = await gelatoClient.createDraftOrder(testData);

        return NextResponse.json({
            success: true,
            message: "Gelato API test successful",
            data: {
                gelatoOrderUid: result.orderUid,
                status: result.status,
                fullResponse: result,
            },
            testData: {
                ...testData,
                imageUrl: testData.imageUrl.substring(0, 50) + "...",
            },
        });

    } catch (error: any) {
        console.error("[Test Gelato API] Error:", error);
        
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown error",
            errorName: error.name,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            hint: "Check your GELATO_API_KEY and ensure it's valid. Also verify the productUid and imageUrl are correct.",
        }, { status: 500 });
    }
}

/**
 * POST /api/test-gelato - Testet die Gelato API mit benutzerdefinierten Daten
 */
export async function POST(req: Request) {
    try {
        // Prüfe ob GELATO_API_KEY gesetzt ist
        if (!process.env.GELATO_API_KEY) {
            return NextResponse.json({
                success: false,
                error: "GELATO_API_KEY environment variable is not set",
            }, { status: 500 });
        }

        const body = await req.json().catch(() => ({}));
        
        // Verwende Body-Daten oder Fallback auf Dummy-Daten
        const testData = {
            productUid: body.productUid || "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor",
            imageUrl: body.imageUrl || "https://replicate.delivery/pbxt/test-image.jpg",
            shippingAddress: body.shippingAddress || {
                name: "Test Customer",
                addressLine1: "Teststraße 123",
                addressLine2: "",
                city: "Berlin",
                state: "",
                zipCode: "10115",
                country: "DE",
            },
            quantity: body.quantity || 1,
        };

        console.log("[Test Gelato API] Testing with custom data:", {
            productUid: testData.productUid,
            imageUrl: testData.imageUrl.substring(0, 50) + "...",
            shippingAddress: testData.shippingAddress,
        });

        // Versuche eine Draft Order zu erstellen
        const result = await gelatoClient.createDraftOrder(testData);

        return NextResponse.json({
            success: true,
            message: "Gelato API test successful",
            data: {
                gelatoOrderUid: result.orderUid,
                status: result.status,
                fullResponse: result,
            },
        });

    } catch (error: any) {
        console.error("[Test Gelato API] Error:", error);
        
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown error",
            errorName: error.name,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }, { status: 500 });
    }
}

