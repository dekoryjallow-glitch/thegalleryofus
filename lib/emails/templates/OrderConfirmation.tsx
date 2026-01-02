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

interface OrderConfirmationEmailProps {
    customerName: string;
    orderNumber: string;
    imageUrl: string;
}

export const OrderConfirmationEmail = ({
    customerName = "Art Lover",
    orderNumber = "#GOU-12345",
    imageUrl = "https://thegalleryofus.com/placeholder-art.jpg",
}: OrderConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Deine Kunst wird nun lebendig – Bestellung {orderNumber}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Text style={logoText}>The Gallery of Us</Text>
                </Section>
                <Section style={contentSection}>
                    <Heading style={h1}>Vielen Dank für deine Bestellung, {customerName}!</Heading>
                    <Text style={text}>
                        Wir haben deine Bestellung {orderNumber} erhalten und fangen direkt an, sie vorzubereiten.
                    </Text>
                    <Section style={imageContainer}>
                        <Img
                            src={imageUrl}
                            width="500"
                            alt="Dein Kunstwerk"
                            style={artworkImage}
                        />
                    </Section>
                    <Text style={text}>
                        Sobald dein Kunstwerk fertiggestellt und auf dem Weg zu dir ist, erhältst du eine weitere Nachricht mit deiner Sendungsnummer.
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Hinter The Gallery of Us stehen Menschen, die deine Liebe zur Kunst teilen. Solltest du Fragen haben, antworte einfach auf diese Mail.
                    </Text>
                    <Link href="https://thegalleryofus.com" style={button}>
                        Meine Galerie ansehen
                    </Link>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default OrderConfirmationEmail;

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
    backgroundColor: '#111827', // Gray-900 like the admin bar
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

const imageContainer = {
    margin: '30px 0',
    padding: '0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const artworkImage = {
    borderRadius: '4px',
    margin: '0 auto',
};

const hr = {
    borderColor: '#EFE6DD',
    margin: '30px 0',
};

const footer = {
    color: '#9CA3AF',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '40px',
};

const button = {
    backgroundColor: '#C17C5C', // Terracotta
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
};
