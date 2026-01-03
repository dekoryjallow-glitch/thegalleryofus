import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import React from 'react';

interface ShippingNotificationEmailProps {
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
}

export const ShippingNotificationEmail = ({
    orderNumber = "#GOU-12345",
    trackingNumber = "TRK123456789",
    trackingUrl = "#",
}: ShippingNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>Wir haben deine Sendung dem Logistikpartner übergeben.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Text style={logoText}>The Gallery of Us</Text>
                </Section>
                <Section style={contentSection}>
                    <Heading style={h1}>Dein Kunstwerk ist unterwegs</Heading>
                    <Text style={text}>
                        Gute Nachrichten: Wir haben deine Bestellung {orderNumber} soeben an unseren Versandpartner übergeben.
                    </Text>
                    <Text style={text}>
                        Dein Kunstwerk ist nun auf dem Weg zu dir. In Kürze wird es deine Wände verschönern und deine Geschichte zum Leben erwecken.
                    </Text>

                    <Section style={trackingBox}>
                        <Text style={trackingLabel}>Sendungsnummer</Text>
                        <Text style={trackingValue}>{trackingNumber}</Text>
                        <Link href={trackingUrl} style={button}>
                            Sendung verfolgen
                        </Link>
                    </Section>

                    <Hr style={hr} />
                    <Text style={footer}>
                        Solltest du Fragen zum Versand haben, antworte einfach direkt auf diese E-Mail. Wir helfen dir gerne weiter.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default ShippingNotificationEmail;

const main = {
    backgroundColor: '#F9F5F0',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 0 60px',
    width: '580px',
};

const logoSection = {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    textAlign: 'center' as const,
    borderBottom: '1px solid #EFE6DD',
};

const logoText = {
    color: '#111827',
    fontSize: '20px',
    fontWeight: '400',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    margin: '0',
};

const contentSection = {
    backgroundColor: '#ffffff',
    padding: '48px 40px',
    borderRadius: '0 0 4px 4px',
};

const h1 = {
    color: '#111827',
    fontSize: '24px',
    fontWeight: '500',
    lineHeight: '1.4',
    margin: '0 0 32px',
    textAlign: 'center' as const,
};

const text = {
    color: '#4B5563',
    fontSize: '16px',
    lineHeight: '1.7',
    margin: '0 0 24px',
};

const trackingBox = {
    backgroundColor: '#F9F5F1',
    padding: '32px',
    borderRadius: '4px',
    textAlign: 'center' as const,
    margin: '32px 0',
};

const trackingLabel = {
    color: '#9CA3AF',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    margin: '0 0 8px',
};

const trackingValue = {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '500',
    margin: '0 0 24px',
};

const hr = {
    borderColor: '#EFE6DD',
    margin: '40px 0',
};

const footer = {
    color: '#9CA3AF',
    fontSize: '14px',
    lineHeight: '1.6',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#C17C5C',
    borderRadius: '2px',
    color: '#fff',
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '14px',
    fontWeight: '500',
    letterSpacing: '0.05em',
};
