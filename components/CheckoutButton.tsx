"use client";

import { useState } from "react";
// Assuming you have a Button component, otherwise fallback to HTML button
import { Button } from "@/components/ui/Button";

export default function CheckoutButton() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No URL returned from checkout API", data);
                alert("Something went wrong with the checkout init.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to start checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Wird geladen..." : "Jetzt für 74,90 € sichern"}
        </Button>
    );
}
