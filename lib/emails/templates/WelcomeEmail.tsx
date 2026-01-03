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

export const WelcomeEmail = () => (
    <Html>
        <Head />
        <Preview>Willkommen in der Gemeinschaft von The Gallery of Us.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Text style={logoText}>The Gallery of Us</Text>
                </Section>
                <Section style={contentSection}>
                    <Heading style={h1}>Schön, dass du da bist.</Heading>
                    <Text style={text}>
                        Willkommen bei The Gallery of Us. Wir freuen uns, dass du den Weg zu uns gefunden hast.
                    </Text>
                    <Text style={text}>
                        Unsere Mission ist es, persönliche Momente und tiefe Verbindungen in zeitlose Kunstwerke zu verwandeln – schlicht, ästhetisch und von bleibendem Wert.
                    </Text>
                    <Text style={text}>
                        In deiner Galerie kannst du nun beginnen, deine eigenen Erinnerungen festzuhalten. Wir begleiten dich dabei mit Ruhe und Sorgfalt.
                    </Text>
                    <Link href="https://thegalleryofus.com/create" style={button}>
                        Zur Galerie
                    </Link>
                    <Hr style={hr} />
                    <Text style={footer}>
                        Hinter The Gallery of Us stehen Menschen, die deine Liebe zur Kunst teilen. Solltest du Fragen haben, antworte einfach auf diese Nachricht.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

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
    marginTop: '32px',
    fontWeight: '500',
    letterSpacing: '0.05em',
};
