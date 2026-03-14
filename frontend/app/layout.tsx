import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin", "thai"],
    variable: "--font-sarabun",
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
                className={`${sarabun.variable} font-sans antialiased bg-slate-50 text-slate-900`}
            >
                {children}
            </body>
        </html>
    );
}
