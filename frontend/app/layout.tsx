import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const IBM = IBM_Plex_Sans({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Political Party Analysis",
    description: "2D Visualization of political party data",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body
                className={`${IBM.variable} font-sans antialiased bg-slate-50 text-slate-900`}
            >
                {children}
            </body>
        </html>
    );
}
