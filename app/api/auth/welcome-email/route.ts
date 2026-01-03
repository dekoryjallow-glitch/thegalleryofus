import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { WelcomeEmail } from "@/lib/emails/templates/WelcomeEmail";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        console.log(`[Auth API] Sending welcome email to: ${email}`);

        const { data, error } = await resend.emails.send({
            from: 'The Gallery of Us <shop@thegalleryofus.com>',
            to: email,
            subject: 'Schön, dass du da bist.',
            react: WelcomeEmail(),
        });

        if (error) {
            console.error("[Auth API] Resend error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error("[Auth API] Welcome email error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
