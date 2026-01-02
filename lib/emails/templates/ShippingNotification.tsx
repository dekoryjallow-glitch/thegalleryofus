import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import React from 'react';

interface ShippingNotificationEmailProps {
    customerName: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
}

export const ShippingNotificationEmail = ({
    customerName = "Art Lover",
    orderNumber = "#GOU-12345",
    trackingNumber = "TRK123456789",
    trackingUrl = "#",
}: ShippingNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>Große Vorfreude! Deine Kunst ist unterwegs – {orderNumber}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Text style={logoText}>The Gallery of Us</Text>
                </Section>
                <Section style={contentSection}>
                    <Heading style={h1}>Gute Nachrichten, {customerName}!</Heading>
                    <Text style={text}>
                        Dein Kunstwerk ist fertig und hat soeben unser Studio verlassen. Es macht sich nun auf den Weg zu dir.
                    </Text>

                    <Section style={trackingBox}>
                        <Text style={trackingLabel}>Deine Sendungsnummer:</Text>
                        <Text style={trackingValue}>{trackingNumber}</Text>
                        <Link href={trackingUrl} style={button}>
                            Sendung verfolgen
                        </Link>
                    </Section>

                    <Text style={text}>
                        Wir können es kaum erwarten, dass deine Geschichte bald deinen Raum verschönert. Teile doch ein Foto davon und markiere uns in deinen Erinnerungen.
                    </Text>

                    <Hr style={hr} />
                    <Text style={footer}>
                        Bei Fragen zur Sendung kannst du dich jederzeit bei uns melden.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default ShippingNotificationEmail;

const main = {
    backgroundColor: '#F9F5F0',
    fontFamily: 'serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};

const logoSection = {
    padding: '30px',
    backgroundColor: '#111827',
    textAlign: 'center' as const,
};

const logoText = {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const contentSection = {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '0 0 8px 8px',
    border: '1px solid #EFE6DD',
};

const h1 = {
    color: '#111827',
    fontSize: '26px',
    fontWeight: '700',
    lineHeight: '1.3',
    margin: '0 0 20px',
    textAlign: 'center' as const,
};

const text = {
    color: '#4B5563',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 20px',
};

const trackingBox = {
    backgroundColor: '#F9F5F0',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const trackingLabel = {
    color: '#9CA3AF',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 8px',
};

const trackingValue = {
    color: '#111827',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 24px',
};

const hr = {
    borderColor: '#EFE6DD',
    margin: '30px 0',
};

const footer = {
    color: '#9CA3AF',
    fontSize: '14px',
    lineHeight: '1.6',
};

const button = {
    backgroundColor: '#C17C5C',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
};
